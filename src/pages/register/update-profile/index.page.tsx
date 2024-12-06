import { zodResolver } from '@hookform/resolvers/zod'
import {
  Avatar,
  Button,
  Heading,
  MultiStep,
  Text,
  TextArea,
} from '@ignite-ui/react'
import { ArrowRight } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Container, Header } from '../styles'
import { FormAnnotation, ProfileBox } from './styles'
import { GetServerSideProps } from 'next'
import { getServerSession } from 'next-auth'
import { buildNextAuthOptions } from '../../api/auth/[...nextauth].api'
import { useSession } from 'next-auth/react'
import { api } from '../../../lib/axios'
import { useRouter } from 'next/router'

export default function UpdateProfile() {
  const validationSchema = z.object({
    bio: z.string(),
  })

  type UpdataProfileFormData = z.infer<typeof validationSchema>
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<UpdataProfileFormData>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      bio: '',
    },
  })

  const session = useSession()
  const router = useRouter()

  async function handleUpdateProfile(data: UpdataProfileFormData) {
    await api.put('/users/profile', {
      bio: data.bio,
    })
    await router.push(`/schedule/${session.data?.user.username}`)
  }
  return (
    <Container>
      <Header>
        <Heading as={'strong'}>Bem-vindo ao Ignite Call!</Heading>
        <Text>
          Precisamos de algumas informações para criar o seu perfil! Ah, voce
          pode editar essa informações depois.
        </Text>
        <MultiStep currentStep={4} size={4}></MultiStep>
      </Header>
      <ProfileBox as={'form'} onSubmit={handleSubmit(handleUpdateProfile)}>
        <label>
          <Text size={'sm'}>Foto de perfil</Text>
          <Avatar
            src={session.data?.user.avatar_url}
            alt={session.data?.user.username}
          />
        </label>

        <label>
          <Text size={'sm'}>Nome completo</Text>
          <TextArea {...register('bio')} />
          <FormAnnotation size={'sm'}>
            Fale um pouco sobre voce isso será exibido em sua pagina pessoal.
          </FormAnnotation>
        </label>
        <Button type="submit" disabled={isSubmitting}>
          Finalizar
          <ArrowRight />
        </Button>
      </ProfileBox>
    </Container>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getServerSession(
    req,
    res,
    buildNextAuthOptions(req, res),
  )
  return {
    props: {
      session,
    },
  }
}
