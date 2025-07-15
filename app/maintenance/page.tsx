// app/maintenance/page.tsx
export default function MaintenancePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-4">🚧 Site Under Maintenance</h1>
        <p className="text-lg mb-6">
          We're working on some improvements. Please check back soon!
        </p>
        <p className="text-sm text-gray-500">
          If you're the site owner, <a href="/" className="text-blue-500">click here</a> to enter password.
        </p>
      </div>
    </div>
  )
}