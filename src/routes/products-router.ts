import {Request, Response, Router} from 'express';
import {productsService} from '../domain/product-service';
import {body, validationResult} from 'express-validator';
import {inputValidationMiddleware} from '../middlewares/input-validation-middleware';
import {ProductType} from '../repositories/db';



export const productsRouter = Router({})

const titleValidation =  body('title').trim().isLength({min: 3, max: 10})
        .withMessage('Title length should be from 3 to 10 symbols') // f-я body

productsRouter.get('/', async (req: Request, res: Response) => {
    const foundProducts: ProductType[] = await productsService.findProducts(req.query.title?.toString());


    res.send(foundProducts)

})
productsRouter.post('/',
    titleValidation,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
        const newProduct: ProductType = await productsService.createProduct(req.body.title)
        res.sendStatus(201).send(newProduct)
    })
productsRouter.get('/:id', async (req: Request, res: Response) => {
    let product = await productsService.findProductById(+req.params.id)
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
    const isUpdated = await productsService.updateProduct(+req.params.id, req.body.title)
        if (isUpdated) {
            const product: boolean = await productsService.findProductById(+req.params.id)
            res.send(product)
        } else {
            res.send(404)
        }
})
productsRouter.delete('/:id', async (req: Request, res: Response) => {
    const isDeleted = await productsService.deleteProduct(+req.params.id)
    if (isDeleted) {
        res.send(204);
    } else {
        res.send(404);
    }
});

