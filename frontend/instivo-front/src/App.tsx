import { useState } from 'react'
import './App.css'
import { EmployeeRegistrationPage } from './pages/EmployeeRegistration'
import { EmployeeListPage } from './pages/EmployeeListPage'
import { Button } from './components/ui/button'

export default function App() {
  const [currentPage, setCurrentPage] = useState<'list' | 'register'>('list')

  return (
    <div>
      <nav className="bg-white border-b border-gray-200 p-4 mb-6">
        <div className="max-w-7xl mx-auto flex gap-4">
          <Button 
            variant={currentPage === 'list' ? 'default' : 'outline'}
            onClick={() => setCurrentPage('list')}
          >
            Listar Funcionários
          </Button>
          <Button 
            variant={currentPage === 'register' ? 'default' : 'outline'}
            onClick={() => setCurrentPage('register')}
          >
            Cadastrar Funcionário
          </Button>
        </div>
      </nav>
      
      {currentPage === 'list' ? <EmployeeListPage /> : <EmployeeRegistrationPage />}
    </div>
  )
}