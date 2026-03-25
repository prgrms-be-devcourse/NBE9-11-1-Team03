export type ProductDto = {
    prodId: number;
    prodName: string;
    prodPrice: number;
    description: string;
};

export type OrderDto = {
    orderId: number;
    email: string;
    postalCode: string;
    detailAddress: string;
    orderTime: string;
    totalPrice: number;       
    items: ItemResponse[]; 
};

export type ItemResponse = {
    productId: number;
    prodName: string;
    prodQuantity: number;
    prodPrice: number;
};

declare global {
    interface Window {
        daum: any;
    }
}