import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import axios from 'axios'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { MainLayout } from '@/components/Layout'

export default function Register() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    cpf: '',
    photo: null,
    photoPreview: null,
    password: '',
    role: 'cliente',
    confirmPassword: '',
    acceptTerms: false
  })
  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório'
    if (!formData.email) newErrors.email = 'Email é obrigatório'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Email inválido'
    if (!formData.phone) newErrors.phone = 'Telefone é obrigatório'
    if (!formData.cpf) newErrors.cpf = 'CPF é obrigatório'
    else if (!/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(formData.cpf) && !/^\d{11}$/.test(formData.cpf)) newErrors.cpf = 'CPF inválido (formatos: 000.000.000-00 ou 00000000000)'
    if (!formData.photo) newErrors.photo = 'Foto de perfil é obrigatória'
    if (!formData.password) newErrors.password = 'Senha é obrigatória'
    else if (formData.password.length < 8) newErrors.password = 'Senha deve ter no mínimo 8 caracteres'
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'As senhas não correspondem'
    if (!formData.acceptTerms) newErrors.acceptTerms = 'Você deve aceitar os termos'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    if (type === 'file') {
      const file = e.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          setFormData(prev => ({ 
            ...prev, 
            photo: file,
            photoPreview: e.target.result
          }))
        }
        reader.readAsDataURL(file)
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    }
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setLoading(true)
    try {
      const formDataToSend = new FormData()
      formDataToSend.append('name', formData.name)
      formDataToSend.append('email', formData.email)
      formDataToSend.append('phone', formData.phone)
      formDataToSend.append('cpf', formData.cpf)
      formDataToSend.append('password', formData.password)
      formDataToSend.append('role', formData.role)
      if (formData.photo) {
        formDataToSend.append('photo', formData.photo)
      }
      
      const { data } = await axios.post('/api/auth/register', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      toast.success('Conta criada com sucesso!')
      router.push('/dashboard')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao criar conta')
      if (error.response?.data?.errors) setErrors(error.response.data.errors)
    } finally { setLoading(false) }
  }

  return (
    <>
      <Head>
        <title>Criar Conta - Leidy Cleaner</title>
        <meta name="description" content="Crie sua conta Leidy Cleaner e comece a agendar serviços de limpeza" />
      </Head>
      <MainLayout>
        <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-primary-900 dark:to-primary-800 py-16">
          <div className="w-full max-w-xl px-6">
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-primary-800 rounded-2xl shadow-2xl p-8">
              <h1 className="text-3xl font-black text-center mb-2 text-gray-900 dark:text-white">Criar Conta</h1>
              <p className="text-center text-gray-600 dark:text-gray-300 mb-8">Junte-se à Leidy Cleaner e aproveite nossos serviços premium</p>

              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nome Completo</label>
                  <input name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-primary-700 dark:bg-primary-900 dark:text-white" />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                  <input name="email" type="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-primary-700 dark:bg-primary-900 dark:text-white" />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Telefone</label>
                    <input name="phone" value={formData.phone} onChange={handleChange} placeholder="(11) 99999-9999" className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-primary-700 dark:bg-primary-900 dark:text-white" />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">CPF</label>
                    <input name="cpf" value={formData.cpf} onChange={handleChange} placeholder="000.000.000-00" className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-primary-700 dark:bg-primary-900 dark:text-white" />
                    {errors.cpf && <p className="text-red-500 text-sm mt-1">{errors.cpf}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Senha</label>
                    <input name="password" type="password" value={formData.password} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-primary-700 dark:bg-primary-900 dark:text-white" />
                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Confirmar Senha</label>
                    <input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-primary-700 dark:bg-primary-900 dark:text-white" />
                    {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                  </div>
                </div>

                <div className="border-2 border-dashed border-gray-300 dark:border-primary-700 rounded-lg p-6 text-center">
                  <input 
                    type="file" 
                    name="photo" 
                    accept="image/*" 
                    onChange={handleChange} 
                    className="hidden" 
                    id="photoInput"
                  />
                  <label htmlFor="photoInput" className="cursor-pointer block">
                    {formData.photoPreview ? (
                      <div>
                        <img src={formData.photoPreview} alt="Preview" className="w-24 h-24 rounded-full mx-auto mb-2 object-cover" />
                        <p className="text-sm text-green-600 font-semibold">✓ Foto selecionada</p>
                        <p className="text-xs text-gray-500 mt-1">Clique para alterar</p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-2xl mb-2">📸</p>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Selecione sua foto de perfil</p>
                        <p className="text-xs text-gray-500 mt-1">PNG, JPG até 5MB</p>
                      </div>
                    )}
                  </label>
                  {errors.photo && <p className="text-red-500 text-sm mt-2">{errors.photo}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tipo de Conta</label>
                  <select name="role" value={formData.role} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-primary-700 dark:bg-primary-900 dark:text-white">
                    <option value="cliente">Cliente</option>
                    <option value="funcionario">Funcionário</option>
                    <option value="adm">Administrador</option>
                  </select>
                </div>

                <div className="flex items-start gap-3">
                  <input type="checkbox" name="acceptTerms" checked={formData.acceptTerms} onChange={handleChange} className="mt-1 w-4 h-4 rounded border-gray-300 text-secondary-600 focus:ring-secondary-500" />
                  <label className="text-sm text-gray-600 dark:text-gray-400">Concordo com os <Link href="/terms" className="text-secondary-600">Termos</Link> e <Link href="/privacy" className="text-secondary-600">Política</Link></label>
                </div>

                <button type="submit" disabled={loading} className="btn-primary w-full py-3">{loading ? 'Criando conta...' : 'Criar Conta'}</button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">Já tem conta? <Link href="/login" className="text-secondary-600">Entrar</Link></p>
              </div>
            </motion.div>
          </div>
        </main>
      </MainLayout>
    </>
  )
}
