import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '../services/supabase'
const routes = [
  { path: '/', component: () => import('../pages/HomePage.vue') },
  { path: '/app/login', component: () => import('../pages/AuthPage.vue'), props: { mode: 'login' } },
  { path: '/app/register', component: () => import('../pages/AuthPage.vue'), props: { mode: 'register' } },
  { path: '/app/dashboard', component: () => import('../pages/DashboardPage.vue'), meta: { auth: true } },
  { path: '/:pathMatch(.*)*', component: () => import('../pages/NotFoundPage.vue') }
]
const router = createRouter({ history: createWebHistory(), routes, scrollBehavior: (to) => to.hash ? { el: to.hash } : { top: 0 } })
router.beforeEach(async (to) => {
  if (!to.meta.auth) return true
  const { data } = await supabase.auth.getSession()
  return data.session ? true : '/app/login'
})
export default router
