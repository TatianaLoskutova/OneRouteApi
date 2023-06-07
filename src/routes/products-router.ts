import {Request, Response, Router} from 'express';
import {productsRepository, ProductType} from '../repositories/products-db-repository';
import {body, validationResult} from 'express-validator';
import {inputValidationMiddleware} from '../middlewares/input-validation-middleware';



export const productsRouter = Router({})

const titleValidation =  body('title').trim().isLength({min: 3, max: 10})
        .withMessage('Title length should be from 3 to 10 symbols') // f-я body

productsRouter.get('/', async (req: Request, res: Response) => {
    const foundProducts: ProductType[] = await productsRepository.findProducts(req.query.title?.toString());


    res.send(foundProducts)

})
productsRouter.post('/',
    titleValidation,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
        const newProduct: ProductType = await productsRepository.createProduct(req.body.title)
        res.sendStatus(201).send(newProduct)
    })
productsRouter.get('/:id', async (req: Request, res: Response) => {
    let product = await productsRepository.findProductById(+req.params.id)
    if (product) {
        res.send(product)
    } else {
        res.send(404)
    }
})
productsRouter.put('/:id',
    titleValidation,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
    const isUpdated = await productsRepository.updateProduct(+req.params.id, req.body.title)
        if (isUpdated) {
            const product: boolean =  productsRepository.findProductById(+req.params.id)
            res.send(product)
        } else {
            res.send(404)
        }
})
productsRouter.delete('/:id', async (req: Request, res: Response) => {
    const isDeleted = await productsRepository.deleteProduct(+req.params.id)
    if (isDeleted) {
        res.send(204);
    } else {
        res.send(404);
    }
});

