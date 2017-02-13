$(document).ready(function() {
    
    var dataObj = {
        amountRequired : 1000,
        amountRecieved : 0,
        count : 0,
        saveRequired : function (credited) {
            this.amountRequired = credited;
            this.count += 1;
        }, 
        saveRecieved : function (recieved) {
            this.amountRecieved = recieved + this.amountRecieved;
        },
        getRecieved : function() {
            return this.amountRecieved;
        }, 
        getRequired : function () {
            return this.amountRequired;
        },
        progress : function () {
            return (this.amountRecieved * 100)/(this.amountRecieved + this.amountRequired);
        },
    }
    $("#amountRequired").html("$"+ dataObj.amountRequired);
    var dialog = $( "#dialog" ).dialog({
        autoOpen: false,
        close: function() {
            $( "#dialog" ).empty();
        }
    })
    $("#donateInput").on("input",function(event){
        var val = ($(event.target).val()).toString();
         $("#dynamicAmount").html(val);
    });
    $("#saveBtn").on("click", function(){
        dialogText("Saved!");
    });
    $("#shareBtn").on("click", function(){
        window.open('https://twitter.com/intent/tweet?text=Yah,%20I%20donated!', '_blank');
        (function(){
            FB.ui({
                method: 'share_open_graph',
                action_type: 'og.likes',
                action_properties: JSON.stringify({
                    object:'https://developers.facebook.com/docs/',
                })
            }, function(response){});
        })();
        
    });
    $("#submitAmount").click(function() { 
        var amount = parseInt($("#donateInput").val()); 
        if (dataObj.getRequired() >= amount){
            var requiredAmount = dataObj.getRequired() - amount;
            dataObj.saveRecieved(amount);
            dataObj.saveRequired(requiredAmount);
            setProgress(dataObj.progress());
        }else if (dataObj.getRequired() < dataObj.getRecieved()) {
            var requiredAmount = dataObj.getRequired() - dataObj.getRecieved();
            if (dataObj.getRequired() < 0) {
                requiredAmount = 0;
                dataObj.saveRecieved(dataObj.getRecieved() + amount);
                dataObj.saveRequired(requiredAmount);
            }
        }
    });

    function setProgress(progressVal) {
        $(".donateprogressbar")[0].value = progressVal;
        $("#amountRequired").html(dataObj.getRequired());
        $(".donateheader").append($(
        '<style>div:after { border-top: "16px solid #424242";border-left: "12px solid transparent";border-right: "12px solid transparent"; bottom: 0px;content: "";position: "absolute";left: "'+progressVal+'%";margin-left: "0px";top: "14%";width: "0";height: "0";}</style>')
        );
    }
    function donationCompletion() {
        switch(msg) {
            case "recieved" : 
                dialogText("Thanks for your contribution");
                $( "#dialog" ).dialog("open");
                break;
            case "required" : 
                dialogText("Thanks for your contribution, share/tell friends for more donation, as we required" + amount + "funds!");
                $( "#dialog" ).dialog("open");
                break;
            case "completed" :
                dialogText("Thanks, the donatation. We will use your hard earned money wisely for our project!"); 
                $( "#dialog" ).dialog("open"); 
                break;  
        }
        $("#amountRequired").html("$"+ dataObj.amountRequired);
        $("#donateInfoContributor").html((dataObj.count).toString());
    }
    function dialogText(txt) {
        $("#dialog").append("<p>"+txt+"</p>");
        $( "#dialog" ).dialog("open");
    }

    //-----------------------
    (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
            js = d.createElement(s); js.id = id;
            js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
        
    //-----------------------

});