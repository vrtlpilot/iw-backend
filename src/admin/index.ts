import * as path from 'path';
import * as Router from 'koa-router';
import * as pug from 'pug';
import Pool from '../models/Pool';

const router = new Router();

router.get('/admin/pools', async (ctx) => {
  const pools = await Pool
    .find()
    .sort('-createdAt');
  const fn = pug.compileFile(path.resolve(__dirname, '../', '../', 'templates', 'poolListPage.pug'));
  const params = { pools };
  ctx.body = fn(params);
});

router.get('/admin/pools/:id', async (ctx) => {
  const id = ctx.params.id;
  const pool = await Pool
    .findById(id)
    .populate({
      path: 'owner',
      select: 'name'
    });
  const fn = pug.compileFile(path.resolve(__dirname, '../', '../', 'templates', 'poolPage.pug'));
  const params = { pool };
  ctx.body = fn(params);
})

export default router.routes();
