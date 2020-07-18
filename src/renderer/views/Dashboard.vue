<template>
  <b-container fluid>
    <b-row>
      <b-col>
        <b-row>
          <b-col>
            <!-- 최근 공지 5개 -->
            <b-table striped sticky-header="500px"
            caption-top
            :items="readBoard"
            :fields="boardFields">
              <template v-slot:table-caption>
                <b-container fluid>
                  <b-row>
                    <b-col cols="auto" class="mr-auto" style="padding-left: 0;">최근 공지 5개</b-col>
                    <b-col cols="auto" class=""><router-link to="/board/notice">더보기<b-icon-plus></b-icon-plus></router-link></b-col>
                  </b-row>
                </b-container>
              </template>
              <template v-slot:cell(titlelink)="data">
                <router-link :to="`/board/detail/${data.item._id}`">{{ data.item.title }}</router-link>
              </template>
              <template v-slot:cell(isNotice)="data">
                <b-check disabled v-model="data.value"></b-check>
              </template>
              <template v-slot:cell(createDate)="data">
                {{ $moment(data.value).format('YYYY-MM-DD') }}
              </template>
            </b-table>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <!-- 오늘 일정 5개 -->
            <b-table striped sticky-header="500px"
            caption-top
            :items="readSchedule"
            :fields="scheduleFields">
              <template v-slot:table-caption>
                <b-container fluid>
                  <b-row>
                    <b-col cols="auto" class="mr-auto" style="padding-left: 0;">최근 일정 5개</b-col>
                    <b-col cols="auto" class=""><router-link to="/schedule">더보기<b-icon-plus></b-icon-plus></router-link></b-col>
                  </b-row>
                </b-container>
              </template>
              <template v-slot:cell(start)="data">
                {{ $moment(data.value).format('YYYY-MM-DD') }}
              </template>
              <template v-slot:cell(end)="data">
                {{ $moment(data.value).format('YYYY-MM-DD') }}
              </template>
            </b-table>
          </b-col>
        </b-row>
      </b-col>
      <b-col>
        <b-row>
          <b-col>
            <!-- 최근 주문장 5개 -->
            <b-table striped sticky-header="500px"
            caption-top
            :items="readOrder"
            :fields="orderFields">
              <template v-slot:table-caption>
                <b-container fluid>
                  <b-row>
                    <b-col cols="auto" class="mr-auto" style="padding-left: 0;">최근 주문장 10개</b-col>
                    <b-col cols="auto" class=""><router-link to="/order">더보기<b-icon-plus></b-icon-plus></router-link></b-col>
                  </b-row>
                </b-container>
              </template>
              <template v-slot:cell(productCodes)="row">
                <ul style="margin-bottom:0; padding-left:0;">
                  <li v-for="product in row.item.products" v-bind:key="product.code" style="display:block;">
                    {{product.code}} ({{product.count}}) - {{product.description}}
                  </li>
                </ul>
              </template>
              <template v-slot:cell(createDate)="data">
                {{ $moment(data.value).format('YYYY-MM-DD (dd)') }}
              </template>
            </b-table>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
    <!-- 오늘 수평 이동 5개 -->
    <!-- <b-row>
      <b-col>
        <b-table sticky-header="500px"
        caption-top
        :items="readTrade"
        :fields="tradeFields">
          <template v-slot:table-caption>
            <b-container fluid>
              <b-row>
                <b-col cols="auto" class="mr-auto" style="padding-left: 0;">최근 수평이동 5개</b-col>
                <b-col cols="auto" class=""><router-link to="/trade">더보기<b-icon-plus></b-icon-plus></router-link></b-col>
              </b-row>
            </b-container>
          </template>
          <template v-slot:cell(inOutDate)="data">
            {{ $moment(data.value).format('YYYY-MM-DD') }}
          </template>
          <template v-slot:cell(inOutText)="data">
            {{ data.item.inOut === 10 ? "입고" : "출고" }}
          </template>
        </b-table>
      </b-col>
    </b-row> -->
  </b-container>
</template>

<script>
export default {
  data () {
    return {
      boardFields: [
        { key: 'createDate', label: '작성일' },
        { key: 'titlelink', label: '제목' },
        { key: 'isNotice', label: '공지사항' }
      ],
      scheduleFields: [
        { key: 'title', label: '제목' },
        { key: 'start', label: '시작' },
        { key: 'end', label: '종료' }
      ],
      orderFields: [
        { key: 'createDate', label: '날짜' },
        { key: 'name', label: '주문자' },
        { key: 'productCodes', label: '품번' }
      ],
      tradeFields: [
        { key: 'inOutDate', label: '날짜' },
        { key: 'productCode', label: '품번' },
        { key: 'count', label: '수량' },
        { key: 'storeText', label: '매장' },
        { key: 'inOutText', label: '구분' }
      ]
    }
  },
  created () {
    this.$bus.$emit(this.$common.enum.emitMessage.SET_MENU_NAVIGATE, [])
  },
  mounted () {

  },
  methods: {
    readBoard () {
      const vm = this
      return new Promise((resolve, reject) => {
        vm.$db.boardDatastore.find({})
          .sort({
            isNotice: -1,
            createDate: -1
          })
          .skip(0 * 5)
          .limit(5)
          .exec((err, rows) => {
            if (err) {
              reject(err)
            }
            resolve(rows)
          })
      })
    },
    readSchedule () {
      const vm = this
      return new Promise((resolve, reject) => {
        vm.$db.scheduleDatastore.find({})
          .sort({ start: -1 })
          .skip(0 * 5)
          .limit(5)
          .exec((err, rows) => {
            if (err) {
              reject(err)
            }
            resolve(rows)
          })
      })
    },
    readOrder () {
      const vm = this
      return new Promise((resolve, reject) => {
        vm.$db.orderDatastore.find({
          deliveryEnd: { $in: [null] }
        })
          .sort({ createDate: -1 })
          .skip(0 * 5)
          .limit(10)
          .exec((err, rows) => {
            if (err) {
              reject(err)
            }
            resolve(rows)
          })
      })
    }
    // readTrade () {
    //   const vm = this
    //   return new Promise((resolve, reject) => {
    //     vm.$db.tradeDatastore.find({
    //       isConfirm: false
    //     })
    //       .sort({ createDate: -1 })
    //       .skip(0 * 5)
    //       .limit(5)
    //       .exec((err, rows) => {
    //         if (err) {
    //           reject(err)
    //         }
    //         rows.forEach(row => {
    //           row._rowVariant = row.isConfirm ? '' : row.inOut === 10 ? 'trade-in' : 'trade-out'
    //         })
    //         resolve(rows)
    //       })
    //   })
    // }
  }
}
</script>

<style>
</style>