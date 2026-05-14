import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import ITTicketList from '../views/IT/TicketList.vue'
import UserTicketList from '../views/User/TicketList.vue'
import ITTicket from '../views/IT/Ticket.vue'
import UserTicket from '../views/User/Ticket.vue'
import CreateUser from "../views/IT/CreateUser.vue";

const routes = [
    {
        path: '/',
        name: 'Login',
        component: Login
    },
    {
        path: '/it/tickets',
        name: 'TicketsIT',
        component: ITTicketList
    },
    {
        path: '/tickets',
        name: 'TicketsUser',
        component: UserTicketList
    },
    {
        path: '/it/tickets/:id',
        name: 'ItTicket',
        component: ITTicket
    },
    {
        path: '/tickets/:id',
        name: 'UserTicket',
        component: UserTicket
    },
    {
        path: '/it/user/create',
        name: 'CreateUser',
        component: CreateUser
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router