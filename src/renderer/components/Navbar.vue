<template>
  <b-navbar toggleable="lg" type="dark" variant="warning">
    <b-navbar-brand to="dashboard">
      <!-- <img src="~@/assets/shiba.png" style="height: 56px;"/> -->
      Venushu
    </b-navbar-brand>

    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav>
        <b-nav-item to="customer">고객관리</b-nav-item>
        <b-nav-item to="order">주문장관리</b-nav-item>
      </b-navbar-nav>

      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">
        <b-nav-form>
          <b-input-group>
            <b-form-input placeholder="검색"></b-form-input>
            <b-input-group-append>
              <b-button><b-icon-search></b-icon-search></b-button>
            </b-input-group-append>
          </b-input-group>
        </b-nav-form>

        <!-- <b-nav-item-dropdown text="Lang" right>
          <b-dropdown-item href="#">EN</b-dropdown-item>
          <b-dropdown-item href="#">ES</b-dropdown-item>
          <b-dropdown-item href="#">RU</b-dropdown-item>
          <b-dropdown-item href="#">FA</b-dropdown-item>
        </b-nav-item-dropdown> -->

        <!-- Using 'button-content' slot -->
        <b-nav-item-dropdown no-caret right>
          <template v-slot:button-content>
            <b-icon-person-circle></b-icon-person-circle>
          </template>
          <b-dropdown-item href="#">내정보</b-dropdown-item>
          <b-dropdown-item href="#">로그아웃</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
export default {
}
</script>

<style>

</style>