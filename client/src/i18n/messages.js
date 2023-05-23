import { LOCALES } from "./locales"

export const messages = {
    [LOCALES.ENGLISH]: {

        // login page
        "lucky.serial": "Lucky Serial",
        "login.username": "Username",
        "login.password": "Password",
        "login.button": "Login",
        "login.username.error": "Please enter your login username",
        "login.password.error": "Please enter your password",
        "login.error": "Error",
        "login.failed": "These credentials do not match our records.",

        // navbar
        "search": "Search",

        // sidebar
        "dashboardNav": "Dashboard",
        "generateSerialNav": "Generated Serial",
        "allSerialNav": "All Serial",
        "unclaimedSerialNav": "Active Serial",
        "claimedSerialNav": "Redeemed Serial",
        "logoutNav": "Logout",

        //page: dashboard
        "dashboard": "Dashboard",
        "dash.text": "Lucky Serial",        
        "total.generated": "Total Generated",
        "total": "Total",
        "total.count.redeemed": "Total Count Redeemed",
        "total.rm.redeemed": "Total Amount Redeemed",
        "total.redeemed.count": "Total Redeemed (Count)",
        "most.redeemed.percentage": "Most Redeemed (%)",
        "top10": "Top 10",
        
        // date filter
        "all.time": "ALL TIME",
        "this.year": "THIS YEAR",
        "this.month": "THIS MONTH",
        "last.week": "LAST WEEK",
        "this.week": "THIS WEEK",
        "yesterday": "YESTERDAY",
        "today": "TODAY",
        "start.date": "From",
        "end.date": "To",


        //page: generate
        "generate.serial": "Generate Serial",
        "top.up.credit": "Top Up Credit",
        "generate.amount": "Credit",
        "generate.quantity": "Quantity",
        "generate.buyer": "Buyer Username",
        "generate.button": "Generate",
        "copy": "Copy",
        "serial.number": "Serial Number",
        "serial.credit": "Credit",
        "serial.buyer": "User",
        "serial.purchase.date": "Purchase Date",
        "export.csv": "Export",
        "credit.error.message": "This field must not be empty.",
        "amount.error.message": "This field must not be empty.",
        "remark.error.message": "This field must not be empty.",

        // page: all serial
        "all.serial": "All Serial",
        "redeemed.account": "Acount Redeem",
        "redeemed.date": "Date Redeem",
        "serial.status": "Status",
        "delete": "Delete",

        // page: active serial
        "valid.serial": "Active Serial",

        // page: invalid serial
        "invalid.serial": "Redeemed Serial",
    },


    [LOCALES.CHINESE]: {
        // login page
        "lucky.serial": "幸运序号",
        "login.username": "用户名",
        "login.password": "密码",
        "login.button": "登录",
        "login.username.error": "请输入您的用户名",
        "login.password.error": "请输入您的密码",
        "login.error": "Error",
        "login.failed": "抱歉，您的资料不存在我们的记录",

        // navbar
        "search": "搜索",

        // sidebar
        "dashboardNav": "仪表盘",
        "generateSerialNav": "生成序号",
        "allSerialNav": "所有序号",
        "unclaimedSerialNav": "未兑换序号",
        "claimedSerialNav": "已兑换序号",
        "logoutNav": "退出",

        //page: dashboard
        "dashboard": "仪表盘",
        "dash.text": "幸运序号",        
        "total": "总数",
        "total.count.redeemed": "兑换总数",
        "total.rm.redeemed": "兑换总金额",
        "total.generated": "总生成",
        "total.redeemed.count": "总兑换量",
        "most.redeemed.percentage": "兑换占比",
        "top10": "前10兑换账号",

        // date filter
        "all.time": "全部",
        "this.year": "今年",
        "this.month": "这个月",
        "last.week": "上个星期",
        "this.week": "这个星期",
        "yesterday": "昨天",
        "today": "今天",
        "start.date": "从",
        "end.date": "到",

        //page: generate
        "generate.serial": "生成序号",
        "top.up.credit": "充值",
        "generate.amount": "金额",
        "generate.quantity": "数量",
        "generate.buyer": "备注买家",
        "generate.button": "生成",
        "copy": "复制",
        "serial.number": "序号",
        "serial.credit": "金额",
        "serial.buyer": "买家",
        "serial.purchase.date": "购买日期",
        "export.csv": "导出 CSV",
        "credit.error.message": "须填上序号金额",
        "amount.error.message": "须填上序号金额",
        "remark.error.message": "须填上序号金额",

        // page: all serial
        "all.serial": "所有序号",
        "redeemed.account": "兑换账号",
        "redeemed.date": "兑换日期",
        "serial.status": "状态",
        "delete": "删除",

        // page: active serial
        "valid.serials": "未兑换序号",

        // page: invalid serial
        "invalid.serial": "已兑换序号",
    },


    [LOCALES.MALAY]: {
        // login page
        "lucky.serial": "Lucky Serial",
        "login.username": "Nama Pengguna",
        "login.password": "Kata Laluan",
        "login.button": "Masuk",
        "login.username.error": "Sila masukkan nama pengguna log masuk anda",
        "login.password.error": "Sila masukkan kata laluan anda",
        "login.error": "Error",
        "login.failed": "Bukti kelayakan ini tidak sepadan dengan rekod kami.",

        // navbar
        "search": "Carian",

        // sidebar
        "dashboardNav": "Papan Pemuka",
        "generateSerialNav": "Menjana Nombor Siri",
        "allSerialNav": "Semua Nombor Siri",
        "unclaimedSerialNav": "Siri Belum Ditebus",
        "claimedSerialNav": "Siri Ditebus",
        "logoutNav": "Log Keluar",

        //page: dashboard
        "dashboard": "Papan Pemuka",
        "dash.text": "Lucky Serial",       
        "total": "Jumlah",
        "total.count.redeemed": "Jumlah Kiraan Ditebus",
        "total.rm.redeemed": "Jumlah Amaun yang Ditebus",
        "total.generated": "Jumlah Menjana",
        "total.redeemed.count": "Jumlah Ditebus",
        "most.redeemed.percentage": "Paling Banyak Ditebus",
        "top10": "10 Teratas Akaun yang Ditebus",

        // date filter
        "all.time": "SEMUA",
        "this.year": "TAHUN INI",
        "this.month": "BULAN INI",
        "last.week": "MINGGU LEPAS",
        "this.week": "MINGGU INI",
        "yesterday": "SEMALAM",
        "today": "HARI INI",
        "start.date": "Dari",
        "end.date": "Sampai",

        //page: generate
        "generate.serial": "Menjana Nombor Siri",
        "top.up.credit": "Tambah Nilai Kredit",
        "generate.amount": "Kredit",
        "generate.quantity": "Kuantiti",
        "generate.buyer": "Nama Pembeli",
        "generate.button": "Menjana",
        "copy": "Salinan",
        "serial.number": "Nombor Siri",
        "serial.credit": "Kredit",
        "serial.buyer": "Pembeli",
        "serial.purchase.date": "Tarikh Pembelian",
        "export.csv": "Eksport CSV",
        "credit.error.message": "Tidak boleh diletakkan kosong.",
        "amount.error.message": "Tidak boleh diletakkan kosong.",
        "remark.error.message": "Tidak boleh diletakkan kosong.",

        // page: all serial
        "all.serial": "Semua Nombor Siri",
        "redeemed.account": "Akaun Penebusan",
        "redeemed.date": "Tarikh Penebusan",
        "serial.status": "Taraf",
        "delete": "Padam",

        // page: active serial
        "valid.serials": "Siri Belum Ditebus",

        // page: invalid serial
        "invalid.serial": "Siri Ditebus",
    },
}