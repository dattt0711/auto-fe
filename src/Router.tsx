import { Routes, Route } from 'react-router-dom'
import { AppLayout } from './components/app-layout'
import NotMatch from './pages/NotMatch'
import DetailTestFile from './pages/DetailTestFile'
import Sample from './pages/Sample'
import ComingSoon from './pages/ComingSoon'
import TestFiles from './pages/TestFiles/index'
import Reports from './pages/Reports'
import DetailReport from './pages/DetailReport'

export default function Router() {
    return (
        <Routes>
            <Route element={<AppLayout />}>
                <Route path="test-files">
                    <Route path="" element={<TestFiles />} />
                    <Route path=":id" element={<DetailTestFile />} />
                </Route>
                <Route path="reports">
                    <Route path="" element={<Reports />} />
                    <Route path=":id" element={<DetailReport />} />
                </Route>
                <Route path="pages">
                    <Route path="sample" element={<Sample />} />
                    <Route path="feature" element={<ComingSoon />} />
                </Route>
                <Route path="" element={<TestFiles />} />
                <Route path="*" element={<NotMatch />} />
            </Route>
        </Routes>
    )
}
