'use strict'
let printReceipt=(tags)=>{

  const allItems = loadAllItems();
  const cartItems = buildItemsCount(allItems,tags);

  const allPromotions = loadPromotions();
  const receiptItems = buildReceiptItems(cartItems, allPromotions);

  const receipt = buildItemsTotal(receiptItems);

  const receiptText = buildReceiptText(receipt);

  console.log(receiptText);
}
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
let buildReceiptItems=(cartItems,promotions)=>{
  return cartItems.map(cartItem=>{
    let promotionType=getPromotionType(cartItem.item.barcode,promotions);
    let {subtotal,saved}=discount(cartItem,promotionType);
    return {cartItem,subtotal,saved};
  })
};
let getPromotionType=(barcode,promotions)=>{
  let promotion=promotions.find(promotion=>promotion.barcodes.includes(barcode));
  return promotion?promotion.type:'';

};
let discount=(cartItem,promotionType)=>{
  let freeItemCount=0;
  let freeItemPrice=cartItem.item.price;
  if(promotionType=="BUY_TWO_GET_ONE_FREE"){
    freeItemCount=parseInt(cartItem.count/3);
  }
  else if(promotionType=="A_FIVE_PERCENT_DISCOUNT"){
    freeItemPrice*=0.05;
    freeItemCount=cartItem.count;
  }
  let saved=freeItemPrice*freeItemCount;
  let subtotal=cartItem.item.price*cartItem.count-saved;
  return{subtotal,saved};
};
let buildItemsTotal=(receiptItems)=>{
  let total=0;
  let saveTotal=0;
  for(let receiptItem of receiptItems){
    total+=receiptItem.subtotal;
    saveTotal+=receiptItem.saved;
  }
  return {receiptItems,total,saveTotal};
};
let buildReceiptText=(receipt)=>{

  let receiptItemsText = receipt.receiptItems
      .map(receiptItem => {
        const cartItem = receiptItem.cartItem;
        return `名称：${cartItem.item.name}，\
数量：${cartItem.count}${cartItem.item.unit}，\
单价：${formatMoney(cartItem.item.price)}(元)，\
小计：${formatMoney(receiptItem.subtotal)}(元)`;
      })
      .join('\n');

  return `***<没钱赚商店>收据***
${receiptItemsText}
----------------------
总计：${formatMoney(receipt.total)}(元)
节省：${formatMoney(receipt.saveTotal)}(元)
**********************`;
};

let formatMoney=(money)=>{
  return parseFloat(money).toFixed(2);
};