$(document).ready(function () {

    var options = {
        cellHeight: 80,
        verticalMargin: 20,
        resizable: {
            handles: 'e, se, s, sw, w'
        }
    };

    $('.grid-stack').gridstack(options);

    $("saveButton").on("click", function () { console.log("준비중입니다.") });
    $("loadButton").on("click", function () { console.log("준비중입니다.") });

    $("#closeButton").on("click", closeModal);

    $('#addDataButton').on("click", createData);
    $("#saveDataButton").on("click", saveData);
    $("#deleteDataButton").on("click", deleteData);


    let id = 0;
    function createData() {
        // PARENT DIV
        var grid_item = document.createElement("div");
        $(grid_item)
            .attr("class", "grid-stack-items")
            .attr("id", id)

        // WRAPPER DIV
        var grid_content = document.createElement("div");
        $(grid_content)
            .attr("class", "grid-stack-item-content")


        // HEADER DIV
        var grid_header = document.createElement("div");
        $(grid_header)
            .attr("class", "grid-stack-item-header")

        // HEADER ICON
        var grid_header_icon = document.createElement("i");
        $(grid_header_icon)
            .attr("class", "fas fa-cog grid-stack-item-set")
            .on("click", openModal);

        // BODY DIV
        var grid_body = document.createElement("div");
        $(grid_body)
            .attr("class", "grid-stack-items")

        // APPEND
        $(grid_header).append($(grid_header_icon))
        $(grid_content).append($(grid_header))
        $(grid_content).append($(grid_body))
        $(grid_item).append($(grid_content))
        $('.grid-stack').append(grid_item)

        // MAX, MIN And ADD
        var grid = $('.grid-stack').data('gridstack');
        grid.addWidget($('#' + id), 0, 0, 4, 2, true);
        grid.maxWidth($('#' + id), 6);
        grid.maxHeight($('#' + id), 4);

        id++;
    }


    $("#type").on("change", function () {
        test = this.parentElement.parentElement.parentElement.id;
        dataForm(this.value);
    });



    /*
     * openModal
     */
    function openModal() {
        // PARENT ELEMENT
        var parentElem = this.parentElement.parentElement.parentElement;

        // TITLE
        $("#title").val($(parentElem).attr("data-gs-title"));

        // WIDTH
        $("#width").val($(parentElem).attr("data-gs-width"))
            .attr("max", $(parentElem).attr("data-gs-max-width"))
            .attr("min", $(parentElem).attr("data-gs-min-width"))

        // HEIGHT
        $("#height").val($(parentElem).attr("data-gs-height"))
            .attr("max", $(parentElem).attr("data-gs-max-height"))
            .attr("min", $(parentElem).attr("data-gs-min-height"))

        // TYPE
        $("#type").val($(parentElem).attr("data-gs-type") == null ? "default" : $(parentElem).attr("data-gs-type"))

        // DATA FORM
        dataForm($(parentElem).attr("data-gs-type"), parentElem.id);

        console.log($(parentElem).attr("data-gs-type"));

        $('#modal').attr("data-gs-id", parentElem.id);

        $('#modal').modal();
    }



    /*
     * closeModal
     */
    function closeModal() {
        // DEFAULT
        $("#title").val("");
        $("#width").val("");
        $("#height").val("");
        $("#type").val("default").prop("selected", true);

        // TEXT
        $("#text-content").val("");
        $("#text-color").val("");
        $("#text-size").val("");

        // CLOSE
        $('#modal').attr("data-gs-id", "");
        $('#modal').modal('hide');
    }



    /*
     * dataForm
     */
    function dataForm(data, id = null) {
        if (id == null) {
            id = $('#modal').attr("data-gs-id");
        }
        var parentElem = $("#" + id);


        // DATA FORM
        switch (data) {
            case "text":
                $("#text-size").val(parentElem.attr("data-text-size"));
                $("#text-color").val(parentElem.attr("data-text-color"));
                $("#text-content").val(parentElem.attr("data-text-content"));
                break;
            default:
                break;
        }

        var dataElem = $("#" + data + "Form");
        dataElem.attr("style", "display: block");
    }



    /*
     * saveData
     */
    function saveData() {
        var elem = $("#" + $('#modal').attr("data-gs-id"));

        // DEFAULT
        var data = new Object;
        data.type = $("#type").val();
        data.title = $("#title").val();
        data.width = $("#width").val();
        data.height = $("#height").val();

        $(elem).attr("data-gs-title", data.title);
        $(elem).attr("data-gs-width", data.width);
        $(elem).attr("data-gs-height", data.height);
        $(elem).attr("data-gs-type", data.type);

        // DATA FORM
        switch (data.type) {
            case "text":
                data.text_size = $("#text-size").val();
                data.text_color = $("#text-color").val();
                data.text_content = $("#text-content").val();

                $(elem).attr("data-text-size", data.text_size);
                $(elem).attr("data-text-color", data.text_color);
                $(elem).attr("data-text-content", data.text_content);
                break;
            default:
                data = null;
                break;
        }

        closeModal();
    }



    /*
     * deleteData
     */
    function deleteData() {
        var elem = $("#" + $('#modal').attr("data-gs-id"));

        elem.remove();

        closeModal();
    }

});