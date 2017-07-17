window.onload = function () {
    if (!document.getElementsByClassName) {
        document.getElementsByClassName = function (cls) {
            var ret = [];
            var els = document.getElementsByTagName('*');
            for (var i = 0, len = els.length; i < len; i++) {
                if (els[i].className === cls
                    || els[i].className.indexOf(cls + ' ') >= 0
                    || els[i].className.indexOf(' ' + cls + ' ') >= 0
                    || els[i].className.indexOf(' ' + cls) >= 0) {
                    ret.push(els[i]);
                }
            }
            return ret;
        }
    }

    var cartTable = document.getElementById('cartTable');
    var tr = cartTable.children[1].rows;
    var checkInputs = document.getElementsByClassName('check');
    var checkAllInputs = document.getElementsByClassName('check-all check');
    var selectedTotal = document.getElementById('selectedTotal');
    var priceTotal = document.getElementById('priceTotal');
    var selected = document.getElementById('selected');
    var codePromo = document.getElementById('promoCode');
    var foot = document.getElementById('foot');
    var selectedViewList = document.getElementById('selectedViewList');
    var deleteAll = document.getElementById('deleteAll');
    var checkOut = document.getElementById('checkoutBtn');
    

    
    function getTotal() {
        var seleted = 0;
        var price = 0;
        var HTMLstr = '';
        for (var i = 0, len = tr.length; i < len; i++) {
            if (tr[i].getElementsByTagName('input')[0].checked) {
                tr[i].className = 'on';
                seleted += parseInt(tr[i].getElementsByTagName('input')[1].value);
                price += parseFloat(tr[i].cells[4].innerHTML);
                // HTMLstr += '<div><img src="' + tr[i].getElementsByTagName('img')[0].src + '"><span class="del" index="' + i + '">Delete</span></div>'
                HTMLstr += '<div><img src="' + tr[i].getElementsByTagName('img')[0].src + '"></div>'
            }
            else {
                tr[i].className = '';
            }
        }

        if (sessionStorage["discountValue"]) {
            var decimalValue = sessionStorage.getItem("discountValue"); // whole number = (10)
            var discountPercent  = price.toFixed(2) / 100; // decimal of orig price 24.90 = (0.249)
            sessionStorage.setItem('discountInPercent', discountPercent.toFixed(2));
            selectedTotal.innerHTML = seleted;
            priceTotal.innerHTML = price.toFixed(2) - discountPercent.toFixed(2);
            selectedViewList.innerHTML = HTMLstr;
        }
        else {
            selectedTotal.innerHTML = seleted;
            priceTotal.innerHTML = price.toFixed(2);
            selectedViewList.innerHTML = HTMLstr;
        }
        if (seleted == 0) {
            foot.className = 'foot';
        }

   
       /* if (discounted == 'yes') {
            chkcode.value - priceTotal; 
        }*/
    }

  
    function getSubTotal(tr) {
        var tds = tr.cells;
        var price = parseFloat(tds[2].innerHTML);
        var count = parseInt(tr.getElementsByTagName('input')[1].value);
        var SubTotal = parseFloat(price * count);
        tds[4].innerHTML = SubTotal.toFixed(2);
    }

    for (var i = 0 , len = checkInputs.length; i < len; i++) {
        checkInputs[i].onclick = function () {
            if (this.className === 'check-all check') {
                for (var j = 0; j < checkInputs.length; j++) {
                    checkInputs[j].checked = this.checked;
                }
            }
            if (this.checked == false) {
                for (var k = 0; k < checkAllInputs.length; k++) {
                    checkAllInputs[k].checked = false;
                }
            }
            getTotal();
        }
    }

    selected.onclick = function () {
        if (foot.className == 'foot') {
            if (selectedTotal.innerHTML != 0) {
                foot.className = 'foot show';
            }
        }
        else {
            foot.className = 'foot';
        }
    }

    selectedViewList.onclick = function (e) {
        e = e || window.event;
        var el = e.srcElement;
        if (el.className == 'del') {
            var index = el.getAttribute('index');
            var input = tr[index].getElementsByTagName('checkbox')[0];
            input.checked = false;
            input.onclick();
        }
    }
    



    for (var i = 0; i < tr.length; i++) {
        tr[i].onclick = function (e) {
            e = e || window.event;
            var el = e.srcElement;
            var cls = el.className;
            var input = this.getElementsByTagName('input')[1];
            var val = parseInt(input.value);
            var reduce = this.getElementsByTagName('span')[1];
            switch (cls) {
                case 'add':
                    input.value = val + 1;
                    reduce.innerHTML = '-';
                    getSubTotal(this);
                    break;
                case 'reduce':
                    if (val > 1) {
                        input.value = val - 1;
                    }
                    if (input.value <= 1) {
                        reduce.innerHTML = '';
                    }
                    getSubTotal(this);
                    break;
                case 'delete':
                    var conf = confirm('Delete?');
                    if (conf) {
                        this.parentNode.removeChild(this);
                    }
                    break
                default :
                    break;
            }
            getTotal();
        }
        tr[i].getElementsByTagName('input')[1].onkeyup = function () {
            var val = parseInt(this.value);
            var tr = this.parentNode.parentNode
            var reduce = tr.getElementsByTagName('span')[1];
            if (isNaN(val) || val < 1) {
                val = 1;
            }
            this.value = val;
            if (val <= 1) {
                reduce.innerHTML = '';
            }
            else {
                reduce.innerHTML = '-';
            }
            getSubTotal(tr);
            getTotal();
        }
    }

    deleteAll.onclick = function () {
        if (selectedTotal.innerHTML != '0') {
            var conf = confirm('Delete？');
            if (conf) {
                for (var i = 0; i < tr.length; i++) {
                    var input = tr[i].getElementsByTagName('input')[0];
                    if (input.checked) {
                        tr[i].parentNode.removeChild(tr[i]);
                        i--;
                    }
                }
            }
        }
    }
    

    checkAllInputs[0].checked = false;
    checkAllInputs[0].onclick();

    
    


    
    chkCode.onclick = function()
        {    
        var codeValue = document.getElementById('promoCode').value;
        if (codeValue === hasCode) {
           // alert(codeValue);
           sessionStorage.setItem('discountCode', hasCode);
           sessionStorage.setItem('discountValue', hasDiscount);
           //priceTotal = priceTotal - 10;
           alert('Code Verified! You got '+hasDiscount+'% Discount.');
           getTotal();

        } else if (codeValue == '') {
            alert('Please key-in Promo Code');
            clearSession();
        
        } else {
            alert('Unverified Code');
            clearSession();
        }
       
       
    }

    function clearSession(){
            sessionStorage.removeItem('discountCode');
            sessionStorage.removeItem('discountValue');
            sessionStorage.removeItem('discountInPercent');

    }
     
        checkOut.onclick = function () {
             clearSession();
             window.location.reload();
       }
   
    


 

        clearSession();


        
}






    var discount = document.getElementById('promoCode');
    var chkCode =  document.getElementById('checkCode');
    var hasCode = "I<3AMAYSIM"; // hard coded for this demo.
    var hasDiscount = 10; // hard coded for this demo.