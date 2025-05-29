import { Link, useLocation } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

// Map of path segments to display names
const pathDisplayNames: Record<string, string> = {
  'test-files': 'Test Files',
  'test-cases': 'Test Cases',
  'settings': 'Settings',
  // Add more mappings as needed
}

export function Breadcrumb() {
    const location = useLocation()
    const pathnames = location.pathname.split('/').filter((x) => x)

    // Function to format path segment for display
    const formatPathSegment = (segment: string) => {
        // First check if we have a predefined display name
        if (pathDisplayNames[segment]) {
            return pathDisplayNames[segment]
        }
        // Otherwise format the segment
        return segment
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')
    }

    return (
        <nav className="flex items-center space-x-1 text-sm text-muted-foreground">
            <Link
                to="/"
                className="hover:text-foreground transition-colors"
            >
                Home
            </Link>
            {pathnames.map((value, index) => {
                const last = index === pathnames.length - 1
                const to = `/${pathnames.slice(0, index + 1).join('/')}`
                const displayName = formatPathSegment(value)

                return (
                    <div key={to} className="flex items-center">
                        <ChevronRight className="h-4 w-4" />
                        {last ? (
                            <span className="ml-1 text-foreground font-medium">
                                {displayName}
                            </span>
                        ) : (
                            <Link
                                to={to}
                                className="ml-1 hover:text-foreground transition-colors"
                            >
                                {displayName}
                            </Link>
                        )}
                    </div>
                )
            })}
        </nav>
    )
} 