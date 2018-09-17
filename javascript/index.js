$(document).ready(function () {
    /*
     * Grid Stack
     */
    var options = {
        cellHeight: 80,
        verticalMargin: 20,
        resizable: {
            handles: 'e, se, s, sw, w'
        }
    };

    $('.grid-stack').gridstack(options);



    /*
     * Event Listen
     */
    $("saveButton").on("click", function () { console.log("준비중입니다.") });
    $("loadButton").on("click", function () { console.log("준비중입니다.") });

    $("#closeButton").on("click", closeModal);

    $('#addDataButton').on("click", createData);
    $("#saveDataButton").on("click", saveData);
    $("#deleteDataButton").on("click", deleteData);

    $("#type").on("change", function () { dataForm(this.value); });


    /*
     * Create Object
     */
    let index = 0;
    function createData() {
        var id = "item" + index;

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

        // TITLE
        var grid_header_title = document.createElement("div");
        $(grid_header_title)
            .attr("class", "grid-stack-item-title")

        // HEADER ICON
        var grid_header_icon = document.createElement("i");
        $(grid_header_icon)
            .attr("class", "fas fa-cog grid-stack-item-set")
            .on("click", openModal)

        // BODY DIV
        var grid_body = document.createElement("div");
        $(grid_body)
            .attr("class", "grid-stack-item-body")

        // APPEND
        $(grid_header).append($(grid_header_title))
        $(grid_header).append($(grid_header_icon))
        $(grid_content).append($(grid_header))
        $(grid_content).append($(grid_body))
        $(grid_item).append($(grid_content))
        $('.grid-stack').append(grid_item)

        // MAX, MIN And ADD
        var grid = $('.grid-stack').data('gridstack');
        grid.addWidget($('#' + id), 0, 0, 4, 2, true);
        grid.maxWidth($('#' + id), 6);
        grid.maxHeight($('#' + id), 6);

        index++;
    }






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
            case "chart":
                $("#chart-data").val(parentElem.attr("data-chart-data"));
                break;
            default:
                break;
        }

        var dataForm = $(".data-form");
        dataForm.each(function () {
            $(this).attr("style", "display: none");
        });

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

        elem.attr("data-gs-title", data.title);
        elem.attr("data-gs-width", data.width);
        elem.attr("data-gs-height", data.height);
        elem.attr("data-gs-type", data.type);

        elem.find("div.grid-stack-item-title").text(data.title);

        // DATA FORM
        switch (data.type) {
            case "text":
                data.text_size = $("#text-size").val();
                data.text_color = $("#text-color").val();
                data.text_content = $("#text-content").val();

                elem.attr("data-text-size", data.text_size);
                elem.attr("data-text-color", data.text_color);
                elem.attr("data-text-content", data.text_content);

                elem.find("div.grid-stack-item-body")
                    .css({
                        "font-size": Number(data.text_size),
                        "color": data.text_color
                    })
                    .text(data.text_content);
                break;
            case "chart":
                data.chart_data = $("#chart-data").val();

                elem.attr("data-chart-data", data.chart_data);

                drawChart(elem);
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



    /*
     * chart
     */
    function drawChart(elem) {
        var id = elem.attr("id");
        var data = elem.attr("data-chart-data");

        var object = JSON.parse(data);

        c3.generate({
            bindto: "#" + id + " " + 'div.grid-stack-item-body',
            data: { json: object.data, keys: { value: object.keys } },
            padding: {
                top: 10,
                bottom: 10,
                left: 30,
                right: 30
            }
        });
    }

});

