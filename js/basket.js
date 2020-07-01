window.onload = function(){
    getProducts(showProducts, errorMessage);
    JFitnessBasket.init();
    showBasketPrice();
    showBasket();
};

function getProducts(success, failure) {
    fetch('../products.json')
    .then(response => response.json())
    .then(success)
    .catch(failure);
}

function showProducts(products) {
    Products = products;
    
    let imagePath = "/img/products/";
    let productSection = document.getElementsByClassName('product-items')[0];
    productSection.innerHTML = "";
    products.forEach(product => {
        let productItem = document.createElement('div');
        productItem.className = 'product-item';

        let img = document.createElement('img');
        img.src = imagePath + product.image;
        img.className = 'product-img';
        img.alt = product.title;
        productItem.appendChild(img);

        let title = document.createElement('p');
        let price = document.createElement('p');
        let cost = new Intl.NumberFormat('en-GB', {style: 'currency', currency: 'GBP'}).format(product.price);
        title.innerText = product.title;
        price.innerText = cost;
        productItem.appendChild(title);
        productItem.appendChild(price);

        let addBtn = document.createElement('button');
        addBtn.type = 'button';
        addBtn.className = 'add-btn';
        addBtn.setAttribute('data-product-id', product.id);
        addBtn.innerText = 'add to basket';
        addBtn.addEventListener('click', addItem);
        productItem.appendChild(addBtn);
       
        productSection.appendChild(productItem);
    });
}

function addItem(ev) {
    ev.preventDefault();
    let id = parseInt(ev.target.getAttribute('data-product-id'));
    console.info('added to shopping basket - product:', id);
    JFitnessBasket.add(id, 1);
    showBasketPrice();
    showBasket();
}

function incrementProduct(ev) {
    ev.preventDefault();
    let id = parseInt(ev.target.getAttribute('data-product-id'));
    JFitnessBasket.increase(id, 1);
    let controls = ev.target.parentElement;
    let quantity = controls.getElementsByClassName('quan-input')[0];
    let item = JFitnessBasket.find(id);
    if(item) {
        quantity.innerText = item.quantity;
        showBasketPrice();
    }
}

function decrementProduct(ev) {
    ev.preventDefault();
    let id = parseInt(ev.target.getAttribute('data-product-id'));
    JFitnessBasket.reduce(id, 1);
    let controls = ev.target.parentElement;
    let quantity = controls.getElementsByClassName('quan-input')[0];
    let item = JFitnessBasket.find(id);
    if(item) {
        quantity.innerText = item.quantity;
        showBasketPrice();
    }else{
        showBasketPrice();
        showBasket();
    }
}

function removeProduct(ev) {
    console.log('remove btn pressed');
    let id = parseInt(ev.target.getAttribute('data-product-id'));
    JFitnessBasket.remove(id);
    showBasketPrice();
    showBasket();
}

function showBasketPrice() {
    let priceLabel = document.getElementById('price-label');
    //let basketCount = document.getElementsByClassName('basket-count')[0];
    let cost = new Intl.NumberFormat('en-GB', {style: 'currency', currency: 'GBP'}).format(JFitnessBasket.calculateBasket());
    priceLabel.innerText = 'TOTAL: ' + cost;
    //basketCount.innerText = JFitnessBasket.contents.length;
}

function showBasket() {
    let basketSection = document.getElementsByClassName('basket-items')[0];
    let basketCountNav = document.getElementsByClassName('basket-count-nav')[0];
    let basketCountBasket = document.getElementsByClassName('basket-count-basket')[0];
    showBasketPrice();
    
    basketCountNav.innerText = ' ('+JFitnessBasket.contents.length+')';
    basketCountBasket.innerText = ' ('+JFitnessBasket.contents.length+')';

    let imagePath = "/img/products/";
    basketSection.innerHTML = '';
    let basket = JFitnessBasket.sort('quantity');
    basket.forEach(item => {
        let basketItem = document.createElement('div');
        basketItem.className = 'product';

        let img = document.createElement('img');
        img.src = imagePath + item.image;
        img.className = 'product-img';
        img.alt = item.title;
        basketItem.appendChild(img);

        let title = document.createElement('h3');
        title.innerText = item.title;
        basketItem.appendChild(title);

        let price = document.createElement('p');
        price.style.fontSize = '25px';
        price.style.color = 'yellow';
        let cost = new Intl.NumberFormat('en-GB', {style: 'currency', currency: 'GBP'}).format(item.price);
        price.innerText = cost;
        basketItem.appendChild(price);

        let controls = document.createElement('div');
        controls.className = 'controls';
        basketItem.appendChild(controls);

        let plusBtn = document.createElement('button');
        plusBtn.type = 'button';
        plusBtn.className = 'quan-btn';
        plusBtn.setAttribute('data-product-id', item.id);
        plusBtn.innerText = '+';
        plusBtn.addEventListener('click', incrementProduct);
        basketItem.appendChild(plusBtn);

        let quanInput = document.createElement('div');
        quanInput.className = 'quan-input';
        quanInput.innerText = item.quantity;
        basketItem.appendChild(quanInput);

        let minusBtn = document.createElement('button');
        minusBtn.type = 'button';
        minusBtn.className = 'quan-btn';
        minusBtn.setAttribute('data-product-id', item.id);
        minusBtn.innerText = '-';
        minusBtn.addEventListener('click', decrementProduct);
        basketItem.appendChild(minusBtn);

        let removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'remove-btn';
        removeBtn.setAttribute('data-product-id', item.id);
        removeBtn.innerText = 'remove';
        removeBtn.addEventListener('click', removeProduct);
        basketItem.appendChild(removeBtn);

        basketSection.appendChild(basketItem);
    });
}

function errorMessage(err) {
    console.log(err);
}

const JFitnessBasket = {
    key: 'shopping-basket',
    contents: [],
    init(){
        let _contents = localStorage.getItem(JFitnessBasket.key);
        if(_contents) {
            JFitnessBasket.contents = JSON.parse(_contents);
        }
        else {
            JFitnessBasket.contents = [];
            JFitnessBasket.sync();
        }
    },
    async sync() {
        let _basket = JSON.stringify(JFitnessBasket.contents);
        await localStorage.setItem(JFitnessBasket.key, _basket);
    },
    find(id) {
        let match = JFitnessBasket.contents.filter(item => {
            if(item.id == id) {
                return true;
            }
        });
        if(match && match[0]) {
            return match[0];
        }
    },
    add(id) {
        if(JFitnessBasket.find(id)) {
            JFitnessBasket.increase(id, 1);
        }else {
            let arr = Products.filter(product => {
                if(product.id == id) {
                    return true;
                }
            });
            if(arr && arr[0]) {
                let obj = {
                    id: arr[0].id,
                    title: arr[0].title,
                    description: [0].description,
                    image: arr[0].image,
                    quantity: arr[0].quantity,
                    price: arr[0].price
                };
                JFitnessBasket.contents.push(obj);
                JFitnessBasket.sync();
            }else {
                JFitnessBasket.warn('invalid product');
            }
        }
    },
    increase(id, quantity = 1) {
        JFitnessBasket.contents = JFitnessBasket.contents.map(item => {
            if(item.id === id) 
                item.quantity = item.quantity + quantity;
            return item;
            
        });
        JFitnessBasket.sync();
    },
    reduce(id, quantity) {
        JFitnessBasket.contents = JFitnessBasket.contents.map(item => {
            if(item.id === id) 
                item.quantity = item.quantity - quantity;
            return item;
            
        });
        JFitnessBasket.contents.forEach(async item => {
            if(item.id === id && item.quantity === 0) {
                JFitnessBasket.remove(id);
            }
        });
        JFitnessBasket.sync();
    },
    remove(id) {
        JFitnessBasket.contents = JFitnessBasket.contents.filter(item => {
            if(item.id !== id) {
                return true;
            }
        });
        JFitnessBasket.sync();
    },
    empty() {
        JFitnessBasket.contents = [];
        JFitnessBasket.sync();
    },
    sort(field='title') {
        let sorted = JFitnessBasket.contents.sort((a, b) => {
            if(a[field] > b[field]) {
                return 1;
            }else if(a[field] < a[field]) {
                return -1;
            }else {
                return 0;
            }
        });
        return sorted;
    },
    calculateBasket() {
        var total = 0.00;
        JFitnessBasket.contents.forEach(async item => {
            if(item.quantity > 1) {
                total += item.quantity * item.price;
            }
            else {
                total += item.price;
            }
        });

        return parseFloat(total.toFixed(2));
    },
    basketCount(){
        console.info(JFitnessBasket.contents.length);
    },
    info(message) {
        console.info(message);
    },
    warn(message) {
        console.warn(message);
    }
};

let Products = []; 
