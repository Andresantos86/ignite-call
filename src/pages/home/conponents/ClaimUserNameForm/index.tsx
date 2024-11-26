import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Text, TextInput } from '@ignite-ui/react'
import { ArrowRight } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Form } from './styles'
import { useRouter } from 'next/router'

const validationSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'usuario deve ter mais de 2 letras' })
    .regex(/^([a-z\\-]+)$/i, { message: 'usuario pode ter letras e ifens' })
    .transform((value) => value.toLocaleLowerCase()),
})

// permite letras e ifen uma ou mais vezes /^([a-z\\-]+)$ o sinal de + e que pode repetir e $ significa que precisa começar ou terminar com as regras e i case insensitive/
type ClaimUserName = z.infer<typeof validationSchema>
export function ClaimUserNameForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClaimUserName>({
    resolver: zodResolver(validationSchema),
  })

  const router = useRouter()
  async function handlePreRegister(data: ClaimUserName) {
    console.log(data)
    const { username } = data
    await router.push(`/register?username=${username}`)
  }
  return (
    <Form as={'form'} onSubmit={handleSubmit(handlePreRegister)}>
      <TextInput
        size={'sm'}
        prefix="ignite.com/"
        placeholder="seu-usuario"
        {...register('username')}
      />
      <Button size={'sm'} type="submit">
        Reservar
        <ArrowRight />
      </Button>
      {errors.username ? (
        <Text as="span" size={'sm'}>
          {errors.username?.message}
        </Text>
      ) : null}
    </Form>
  )
}
