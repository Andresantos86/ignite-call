import { Heading, Text } from '@ignite-ui/react'
import { Container, Hero, Preview } from './styles'
import previewImage from '../../assets/app-preview.png'
import Image from 'next/image'
import { ClaimUserNameForm } from './conponents/ClaimUserNameForm'
import { NextSeo } from 'next-seo'

export default function Home() {
  return (
    <>
      <NextSeo
        title="Descomplique sua agenda | Ignite Call"
        description="Conecte seu calendario e permita que as pessoas marquem agendamentos no seu tempo livre."
      />
      <Container>
        <Hero>
          <Heading as="h1" size={'4xl'}>
            Agendamento descomplicado
          </Heading>
          <Text size={'lg'}>
            Conecte seu calendario e permita que as pessoas marquem agendamentos
            no seu tempo livre
          </Text>
          <ClaimUserNameForm />
        </Hero>

        <Preview>
          <Image
            src={previewImage}
            alt="Calendario simbolizando a aplicação em funcionamento"
            height={400}
            quality={100}
            priority
          />
        </Preview>
      </Container>
    </>
  )
}
