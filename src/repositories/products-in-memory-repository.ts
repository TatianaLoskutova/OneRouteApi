// products не экспортируем, это наше секретное знание
export type ProductType = {
    id: number
    title: string
}

const products = [{id:1, title: 'tomato'}, {id:2, title: 'orange'}]

export const productsRepository = {
    // он не знает всяких req, res. Просто засунуть параметр по кот. ищем
    // по сути findProduct endpoint
    // Ты мне дай стринг или ничего или не опред,, мне по херу что там в другом слое
    async findProducts(title: string | null | undefined): Promise<ProductType[]> {
        if (title) {
            let filteredProducts = products.filter(p => p.title.indexOf(title) > -1);
            return filteredProducts;
        } else {
            return products;   // ну если нечего фильтровать вернем целиком массив
        }
    },
    async findProductById(id: number): Promise<ProductType | null> {
        let product = products.find(p => p.id === id)
        return product;
    },
    async createProduct(title: string): Promise<ProductType> {
        const newProduct = {
            id: +(new Date()),
            title: title
        }
        products.push(newProduct)
        return newProduct;
    },
    async updateProduct(id: number, title: string): Promise<boolean> {
        let product = products.find(p => p.id === id);
        if (product) {
            product.title = title
            return true;
        } else {
            return false;
        }
    }
    ,
    async deleteProduct(id: number): Promise<boolean> {
        for (let i = 0; i < products.length; i++) {
            if (products[i].id === id) {
                products.splice(i, 1);
                return true;
            }
        }
        return false
    }


}