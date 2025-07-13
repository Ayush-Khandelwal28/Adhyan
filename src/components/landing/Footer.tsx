'use client';

export function Footer() {
    return (
        <footer 
            className="bg-gray-50 dark:bg-gray-900 py-12 px-6"
            aria-label="Site footer"
        >
            <div className="flex flex-col md:flex-row justify-between items-center">
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                    &copy; {new Date().getFullYear()} Adhyan. All rights reserved.
                </p>
                <div className="mt-4 md:mt-0 flex items-center space-x-6">
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                        Made with ❤️ by Ayush
                    </p>
                </div>
            </div>
        </footer>
    );
}
