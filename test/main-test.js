'use strict';

describe('pos', () => {
  let inputs;
  let allItems;
  let promotions;
  beforeEach(() => {
    inputs = [
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000003-2',
      'ITEM000005',
      'ITEM000005',
      'ITEM000005'
    ];
    allItems=loadAllItems();
    promotions=loadPromotions();
  });

  it('should print correct text', () => {

    spyOn(console, 'log');

    printReceipt(inputs);

    const expectText = `***<没钱赚商店>收据***
名称：雪碧，数量：5瓶，单价：3.00(元)，小计：12.00(元)
名称：荔枝，数量：2斤，单价：15.00(元)，小计：28.50(元)
名称：方便面，数量：3袋，单价：4.50(元)，小计：9.00(元)
----------------------
总计：49.50(元)
节省：9.00(元)
**********************`;

    expect(console.log).toHaveBeenCalledWith(expectText);
  });

  it('shoule calculate items count',()=>{
    let itemscount= buildItemsCount(allItems,inputs);
    const expectItems=[
           {
              item:  {
                         barcode: 'ITEM000001',
                         name: '雪碧',
                         unit: '瓶',
                         price: 3.00},
             count:5},
            {
              item:{
                          barcode: 'ITEM000003',
                          name: '荔枝',
                          unit: '斤',
                          price: 15.00},
              count:2},
            {
              item:{     barcode: 'ITEM000005',
                          name: '方便面',
                          unit: '袋',
                          price: 4.50},
              count:3}];
    expect(itemscount).toEqual(expectItems);
  });
    it('should calculate items subtotal',()=>{
        let itemsSubtotal=buildReceiptItems(buildItemsCount(allItems, inputs),promotions);
        const expectItems=[
            {
                cartItem:{
                    item:  {
                        barcode: 'ITEM000001',
                        name: '雪碧',
                        unit: '瓶',
                        price: 3.00},
                    count:5},
                subtotal:12.00,
                saved:3.00
            },
            {
                cartItem:{
                    item:{
                        barcode: 'ITEM000003',
                        name: '荔枝',
                        unit: '斤',
                        price: 15.00},
                    count:2},
                subtotal:28.50,
                saved:1.50
            },
            {
                cartItem:{
                    item:{     barcode: 'ITEM000005',
                        name: '方便面',
                        unit: '袋',
                        price: 4.50},
                    count:3},
                subtotal:9.00,
                saved:4.50
            }];
        expect(itemsSubtotal).toEqual(expectItems);
    });
    it('should calculate items total', ()=> {
        let itemsSubtotal = buildReceiptItems(buildItemsCount(allItems, inputs), promotions);
        let itemsTotal = buildItemsTotal(itemsSubtotal);
        const expectItems = {
            receiptItems:[
                {
                    cartItem:{
                        item:  {
                            barcode: 'ITEM000001',
                            name: '雪碧',
                            unit: '瓶',
                            price: 3.00},
                        count:5},
                    subtotal:12.00,
                    saved:3.00
                },
                {
                    cartItem:{
                        item:{
                            barcode: 'ITEM000003',
                            name: '荔枝',
                            unit: '斤',
                            price: 15.00},
                        count:2},
                    subtotal:28.50,
                    saved:1.50
                },
                {
                    cartItem:{
                        item:{     barcode: 'ITEM000005',
                            name: '方便面',
                            unit: '袋',
                            price: 4.50},
                        count:3},
                    subtotal:9.00,
                    saved:4.50
                }],
            total: 49.50,
            saveTotal: 9.00
        };
        expect(itemsTotal).toEqual(expectItems);
    });
    it('should print receipt itemInfo',()=>{
        let itemsSubtotal = buildReceiptItems(buildItemsCount(allItems, inputs), promotions);
        let itemsTotal = buildItemsTotal(itemsSubtotal);
        let receiptInfo=buildReceiptText(itemsTotal);

        const expectText=`***<没钱赚商店>收据***
名称：雪碧，数量：5瓶，单价：3.00(元)，小计：12.00(元)
名称：荔枝，数量：2斤，单价：15.00(元)，小计：28.50(元)
名称：方便面，数量：3袋，单价：4.50(元)，小计：9.00(元)
----------------------
总计：49.50(元)
节省：9.00(元)
**********************`
        expect(receiptInfo).toEqual(expectText);
    });
});
