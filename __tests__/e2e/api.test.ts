import request from 'supertest'
import {app} from '../../src';
import {products} from '../../src/routes/products-router';

describe('/products', ()=> {

    it('should return 200 and all products', async () => {
        await request(app)
            .get('/products')
            .expect(200, products)
    });

    it('should return 404 for not existing product', async () => {
        await request(app)
            .get('/products/22')
            .expect(404)
    })

    it('should not create products with incorrect input data', async () => {
        await request(app)
            .post('/products')
            .send({ title: '' })
            .expect(400)

        await request(app)
            .get('/products')
            .expect(200, products)
    })

    let newProduct: any = null;
    it('should  create products with correct input data', async () => {
        const createResponse = await request(app)
            .post('/products')
            .send({title: 'cucumber'})
            .expect(201)

        newProduct = createResponse.body;

        expect(newProduct).toEqual({
            id: expect.any(Number),
            title: 'cucumber'
        })
    })

    let createdProduct: any = null;
    it('create one more product', async () => {
        const response = await request(app)
            .post('/products')
            .send({title: 'Bad new title'})
            .expect(201)

        createdProduct = response.body

        expect(createdProduct).toEqual({
            id: expect.any(Number),
            title: 'Bad new title'
        })

        await request(app)
            .get('/products')
            .expect(200, [newProduct, createdProduct])

    })

    it('should not update products with incorrect input data', async () => {
        await request(app)
            .put('/products/' + newProduct.id)
            .send({title: ''})
            .expect(400)

        await request(app)
            .get('/products/' + newProduct.id)
            .expect(200, newProduct)
    })

    it('should not  update products that not exist', async () => {
        await request(app)
            .put('/products/' + 2)
            .send({title: 'good title'})
            .expect(404)

    })

    it('should  update products with correct input data', async () => {
        await request(app)
            .put('/products/' + newProduct.id)
            .send({title: 'good new title'})
            .expect(204)

        await request(app)
            .get('/products/' + newProduct.id)
            .expect(200, {
                ...newProduct,
                title: 'good new title'
            })

        await request(app)
            .get('/products/' + createdProduct.id)
            .expect(200, createdProduct)

    })

    it('should  delete all products ', async () => {
        await request(app)
            .delete('/products/' + newProduct.id)
            .expect(204)

        await request(app)
            .get('/products/' + newProduct.id)
            .expect(404)

        await request(app)
            .delete('/products/' + createdProduct.id)
            .expect(204)

        await request(app)
            .get('/products/' + createdProduct.id)
            .expect(404)


        await request(app)
            .get('/products')
            .expect(200, [])
    })
})