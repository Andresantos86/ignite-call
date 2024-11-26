import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Heading, MultiStep, Text, TextInput } from '@ignite-ui/react'
import { ArrowRight } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Container, Form, FormError, Header } from './styles'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { api } from '../../lib/axios'

export default function Register() {
  const router = useRouter()

  const validationSchema = z.object({
    username: z
      .string()
      .min(3, { message: 'usuario deve ter mais de 2 letras' })
      .regex(/^([a-z\\-]+)$/i, { message: 'usuario pode ter letras e ifens' })
      .transform((value) => value.toLocaleLowerCase()),

    name: z.string().min(3, { message: 'usuario deve ter mais de 2 letras' }),
  })

  type RegisterFormData = z.infer<typeof validationSchema>
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      username: '',
      name: '',
    },
  })

  useEffect(() => {
    if (router.query.username) {
      setValue('username', String(router.query.username))
    }
  }, [router.query.username, setValue])

  async function handleRegister(data: RegisterFormData) {
    console.log(data)
    try {
      await api.post('/users', {
        name: data.name,
        username: data.username,
      })

      await router.push('/register/connect-calendar')
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <Container>
      <Header>
        <Heading as={'strong'}>Bem-vindo ao Ignite Call!</Heading>
        <Text>
          Precisamos de algumas informações para criar o seu perfil! Ah, voce
          pode editar essa informações depois.
        </Text>
        <MultiStep currentStep={1} size={4}></MultiStep>
      </Header>
      <Form as={'form'} onSubmit={handleSubmit(handleRegister)}>
        <label>
          <Text size={'sm'}>Nome do usuário</Text>
          <TextInput
            prefix="ignite.com/"
            placeholder="seu-usuario"
            {...register('username')}
          />
          {errors.username && (
            <FormError size={'sm'}>{errors.username.message}</FormError>
          )}
        </label>

        <label>
          <Text size={'sm'}>Nome completo</Text>
          <TextInput placeholder="seu-nome" {...register('name')} />
          {errors.name && (
            <FormError size={'sm'}>{errors.name.message}</FormError>
          )}
        </label>
        <Button type="submit" disabled={isSubmitting}>
          Proximo passo
          <ArrowRight />
        </Button>
      </Form>
    </Container>
  )
}
