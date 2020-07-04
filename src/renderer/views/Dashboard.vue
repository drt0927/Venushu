<template>
  <vs-row>
    <vs-row>
      <vs-col>
        <vs-row>
          <vs-col>
            <!-- 최근 공지 5개 -->
            <vs-table :data="boards">
              <template slot="header">
                <h3>
                  게시판
                </h3>
              </template>
              <template slot="thead">
                <vs-th>
                  title
                </vs-th>
                <vs-th>
                  createDate
                </vs-th>
              </template>

              <template slot-scope="{data}">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data" >
                  <vs-td>
                    {{data[indextr].title}}
                  </vs-td>

                  <vs-td>
                    {{data[indextr].createDate}}
                  </vs-td>
                </vs-tr>
              </template>
            </vs-table>
          </vs-col>
        </vs-row>
        <vs-row>
          <vs-col>
            <!-- 오늘 일정 5개 -->
            <!-- <vs-table striped sticky-header="500px"
            caption-top
            :items="readSchedule"
            :fields="scheduleFields">
              <template v-slot:table-caption>
                <vs-container fluid>
                  <vs-row>
                    <vs-col cols="auto" class="mr-auto" style="padding-left: 0;">최근 일정 5개</vs-col>
                    <vs-col cols="auto" class=""><router-link to="/schedule">더보기<vs-icon-plus></vs-icon-plus></router-link></vs-col>
                  </vs-row>
                </vs-container>
              </template>
              <template v-slot:cell(start)="data">
                {{ $moment(data.value).format('YYYY-MM-DD') }}
              </template>
              <template v-slot:cell(end)="data">
                {{ $moment(data.value).format('YYYY-MM-DD') }}
              </template>
            </vs-table> -->
          </vs-col>
        </vs-row>
      </vs-col>
      <vs-col>
        <vs-row>
          <vs-col>
            <!-- 최근 주문장 5개 -->
            <!-- <vs-table striped sticky-header="500px"
            caption-top
            :items="readOrder"
            :fields="orderFields">
              <template v-slot:table-caption>
                <vs-container fluid>
                  <vs-row>
                    <vs-col cols="auto" class="mr-auto" style="padding-left: 0;">최근 주문장 10개</vs-col>
                    <vs-col cols="auto" class=""><router-link to="/order">더보기<vs-icon-plus></vs-icon-plus></router-link></vs-col>
                  </vs-row>
                </vs-container>
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
            </vs-table> -->
          </vs-col>
        </vs-row>
      </vs-col>
    </vs-row>
    <!-- 오늘 수평 이동 5개 -->
    <!-- <vs-row>
      <vs-col>
        <vs-table sticky-header="500px"
        caption-top
        :items="readTrade"
        :fields="tradeFields">
          <template v-slot:table-caption>
            <vs-container fluid>
              <vs-row>
                <vs-col cols="auto" class="mr-auto" style="padding-left: 0;">최근 수평이동 5개</vs-col>
                <vs-col cols="auto" class=""><router-link to="/trade">더보기<vs-icon-plus></vs-icon-plus></router-link></vs-col>
              </vs-row>
            </vs-container>
          </template>
          <template v-slot:cell(inOutDate)="data">
            {{ $moment(data.value).format('YYYY-MM-DD') }}
          </template>
          <template v-slot:cell(inOutText)="data">
            {{ data.item.inOut === 10 ? "입고" : "출고" }}
          </template>
        </vs-table>
      </vs-col>
    </vs-row> -->
  </vs-row>
</template>

<script>
export default {
  data () {
    return {
      boards: []
    }
  },
  created () {
    this.$bus.$emit(this.$common.enum.emitMessage.SET_MENU_NAVIGATE, [])
  },
  mounted () {
    this.readBoard()
  },
  methods: {
    readBoard () {
      const vm = this
      // return new Promise((resolve, reject) => {
      vm.$db.boardDatastore.find({})
        .sort({ createDate: -1 })
        .skip(0 * 5)
        .limit(5)
        .exec((err, rows) => {
          if (err) {
            // reject(err)
          }
          // resolve(rows)
          vm.boards = rows
        })
      // })
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