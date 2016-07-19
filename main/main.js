'use strict'

let buildItemsCount=(allItems,inputs)=>{

  let cartItems=[];
  for(let input of inputs){
    let splitedInput=input.split('-');
    let barcode=splitedInput[0];
    let count=parseFloat(splitedInput[1] || 1);

    let cartItem=cartItems.find(cartItem=>(cartItem.item.barcode===barcode));

    if(cartItem){
      cartItem.count++;
    }
    else{
      let item=allItems.find(item=>(item.barcode===barcode));
      cartItems.push({item:item,count:count});
    }
  }
  return cartItems;
};
