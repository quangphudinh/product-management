module.exports = (query) => {
    // phần bộ lọc dữ liệu
    let filterStatus = [
        {
            name : "Tất cả",
            status : "",
            class : ""
        },{
            name : "Hoạt động",
            status : "active",
            class : ""
        },{
            name : "Dừng hoạt động",
            status : "unactive",
            class : ""
        }
    ]

    //xử lý sự kiện khi kich vào nút all/active/unactive thì focus qua và gán class active nút đó
    if(query.status){
        const index = filterStatus.findIndex(item => item.status === query.status);
        filterStatus[index].class = "active";
    }else{
        const index = filterStatus.findIndex(item => item.status === "");
        filterStatus[index].class = "active";
    }
    return filterStatus;
    // end phần bộ lọc
}