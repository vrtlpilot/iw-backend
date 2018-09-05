import * as path from 'path';
import * as Router from 'koa-router';
import * as pug from 'pug';
import Pool from '../models/Pool';

const router = new Router();

function compileConfirmPage(message) {
  const fn = pug.compileFile(path.resolve(__dirname, '../', '../', 'templates', 'confirmPage.pug'));
  const params = { message };
  return fn(params);
}

async function changePoolStatus(poolId, status) {
  const updatedPool = await Pool.findByIdAndUpdate(poolId, { status }, { new: true }) as any;
  return updatedPool.status;
}

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

router.get('/admin/pools/:id/remove', async (ctx) => {
  const id = ctx.params.id;
  await changePoolStatus(id, 1);
  const message = 'Pool has been removed';
  ctx.body = compileConfirmPage(message);
})

router.get('/admin/pools/:id/block', async (ctx) => {
  const id = ctx.params.id;
  await changePoolStatus(id, 2);
  const message = 'Pool has been blocked';
  ctx.body = compileConfirmPage(message);
})

router.get('/admin/pools/:id/hold', async (ctx) => {
  const id = ctx.params.id;
  await changePoolStatus(id, 3);
  const message = 'Pool has been held';
  ctx.body = compileConfirmPage(message);
})

router.get('/admin/pools/:id/verify', async (ctx) => {
  const id = ctx.params.id;
  await changePoolStatus(id, 4);
  const message = 'Pool has been verified';
  ctx.body = compileConfirmPage(message);
})

router.get('/admin/pools/:id/deploy', async (ctx) => {
  const id = ctx.params.id;
  await changePoolStatus(id, 5);
  const message = 'Pool has been deployed';
  ctx.body = compileConfirmPage(message);
})

export default router.routes();
