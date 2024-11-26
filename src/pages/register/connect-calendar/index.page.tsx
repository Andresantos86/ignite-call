import { Button, Heading, MultiStep, Text } from '@ignite-ui/react'
import { Container, Header } from '../styles'
import { ArrowRight, Check } from 'phosphor-react'
import { AuthError, ConnectBox, ConnectItem } from './styles'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

export default function Register() {
  const session = useSession()
  const router = useRouter()
  const hasAuthError = !!router.query.error
  const isSignedIn = session.status === 'authenticated'
  return (
    <Container>
      <Header>
        <Heading as={'strong'}>Conecte sua agenda!</Heading>
        <Text>
          Conecte o seu calendário para verificar automaticamente as horas
          ocupadas e os novos eventos à medida em que são agendados.
        </Text>
        <MultiStep currentStep={2} size={4}></MultiStep>
      </Header>
      <ConnectBox>
        <ConnectItem>
          <Text>Google Calendar</Text>
          {isSignedIn ? (
            <Button size={'sm'} variant={'secondary'} disabled>
              Conectado
              <Check />
            </Button>
          ) : (
            <Button
              size={'sm'}
              variant={'secondary'}
              onClick={() => signIn('google')}
            >
              Conectar
              <ArrowRight />
            </Button>
          )}
        </ConnectItem>
        {hasAuthError && (
          <AuthError>
            Falha ao se conectar ao Google verifique se você habilitou as
            permissões da acesso ao Google Calendar
          </AuthError>
        )}
        <Button type="submit" disabled={!isSignedIn}>
          Proximo passo
          <ArrowRight />
        </Button>
      </ConnectBox>
    </Container>
  )
}
