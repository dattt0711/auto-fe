import {
    CircleAlert,
    Files,
    LucideIcon,
    TestTube,
    BarChart
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
        title: 'Test Management',
        url: '/test-files',
        icon: TestTube
    },
    {
        title: 'Reports',
        url: '/reports',
        icon: BarChart
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
