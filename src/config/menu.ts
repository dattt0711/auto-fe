import {
    CircleAlert,
    Files,
    Gauge,
    LucideIcon,
    TestTube
} from 'lucide-react'

type MenuItemType = {
    title: string
    url: string
    external?: string
    icon?: LucideIcon
    items?: MenuItemType[]
}
type MenuType = MenuItemType[]

export const mainMenu: MenuType = [
    {
        title: 'Dashboard',
        url: '/',
        icon: Gauge
    },
    {
        title: 'Test Management',
        url: '/test-files',
        icon: TestTube
    },
    {
        title: 'Pages',
        url: '/pages',
        icon: Files,
        items: [
            {
                title: 'Sample Page',
                url: '/pages/sample',
            },
            {
                title: 'Coming Soon',
                url: '/pages/feature',
            },
        ]
    },
    {
        title: 'Error',
        url: '/404',
        icon: CircleAlert,
    },
]
