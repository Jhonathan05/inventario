import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

function App() {
    const [health, setHealth] = useState(null)

    useEffect(() => {
        // Verificar conexión al backend
        axios.get(import.meta.env.VITE_API_URL + '/health')
            .then(res => setHealth(res.data))
            .catch(err => console.error('Error connecting to backend:', err))
    }, [])

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold underline">
                Inventario Tecnológico
            </h1>
            <div className="mt-4 p-4 border rounded shadow">
                <h2 className="text-xl font-semibold">Estado del Sistema</h2>
                <p>API Status: {health ? '✅ Conectado' : '❌ Desconectado'}</p>
                {health && <pre className="bg-gray-100 p-2 mt-2 rounded">{JSON.stringify(health, null, 2)}</pre>}
            </div>
        </div>
    )
}

export default App
