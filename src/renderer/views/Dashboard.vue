<template>
  <b-container fluid>
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
                <b-col cols="auto" class=""></b-col>
              </b-row>
            </b-container>
          </template>
          <template v-slot:cell(titlelink)="data">
            <router-link :to="`/board/detail/${data.item._id}`">{{ data.item.title }}</router-link>
          </template>
          <template v-slot:cell(createDate)="data">
            {{ $moment(data.value).format('YYYY-MM-DD') }}
          </template>
        </b-table>
      </b-col>
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
                <b-col cols="auto" class=""></b-col>
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
                <b-col cols="auto" class="mr-auto" style="padding-left: 0;">최근 주문장 5개</b-col>
                <b-col cols="auto" class=""></b-col>
              </b-row>
            </b-container>
          </template>
          <template v-slot:cell(deliveryStart)="data">
            {{ data.value ? $moment(data.value).format('YYYY-MM-DD') : "" }}
          </template>
          <template v-slot:cell(deliveryEnd)="data">
            {{ data.value ? $moment(data.value).format('YYYY-MM-DD') : "" }}
          </template>
        </b-table>
      </b-col>
      <b-col>
        <!-- 오늘 수평 이동 5개 -->
        <b-table sticky-header="500px"
        caption-top
        :items="readTrade"
        :fields="tradeFields">
          <template v-slot:table-caption>
            <b-container fluid>
              <b-row>
                <b-col cols="auto" class="mr-auto" style="padding-left: 0;">최근 수평이동 5개</b-col>
                <b-col cols="auto" class=""></b-col>
              </b-row>
            </b-container>
          </template>
          <template v-slot:cell(inOutText)="data">
            {{ data.item.inOut === 10 ? "입고" : "출고" }}
          </template>
          <template v-slot:cell(isConfirm)="data">
            <b-check v-model="data.value" disabled></b-check>
          </template>
        </b-table>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  data () {
    return {
      boardFields: [
        { key: 'titlelink', label: '제목' },
        { key: 'typeText', label: '게시판' },
        { key: 'createDate', label: '작성일' }
      ],
      scheduleFields: [
        { key: 'title', label: '제목' },
        { key: 'start', label: '시작' },
        { key: 'end', label: '종료' }
      ],
      orderFields: [
        { key: 'name', label: '주문자' },
        { key: 'deliveryStart', label: '출고' },
        { key: 'deliveryCode', label: '송장' },
        { key: 'deliveryEnd', label: '완료' }
      ],
      tradeFields: [
        { key: 'productCode', label: '품번' },
        { key: 'count', label: '수량' },
        { key: 'storeText', label: '매장' },
        { key: 'isConfirm', label: '확정' },
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
          .sort({ createDate: -1 })
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
          .sort({ createDate: -1 })
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
        vm.$db.orderDatastore.find({})
          .sort({ createDate: -1 })
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
    readTrade () {
      const vm = this
      return new Promise((resolve, reject) => {
        vm.$db.tradeDatastore.find({})
          .sort({ createDate: -1 })
          .skip(0 * 5)
          .limit(5)
          .exec((err, rows) => {
            if (err) {
              reject(err)
            }
            rows.forEach(row => {
              row._rowVariant = row.isConfirm ? '' : row.inOut === 10 ? 'trade-in' : 'trade-out'
            })
            resolve(rows)
          })
      })
    }
  }
}
</script>

<style>
</style>