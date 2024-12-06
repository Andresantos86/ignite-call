import {
  Button,
  Checkbox,
  Heading,
  MultiStep,
  Text,
  TextInput,
} from '@ignite-ui/react'
import { Container, Header } from '../styles'
import {
  FormError,
  IntervalBox,
  IntervalContainer,
  IntervalDay,
  IntervalInputs,
  IntervalItem,
} from './styles'
import { ArrowRight } from 'phosphor-react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'
import { getWeekDays } from '../../../utils/get-week-days'
import { zodResolver } from '@hookform/resolvers/zod'
import { convertTimeStringInMinutes } from '../../../utils/consvert-time-string-to-minutes'
import { api } from '../../../lib/axios'
import { useRouter } from 'next/router'

const formSchema = z.object({
  intervals: z
    .array(
      z.object({
        weekDay: z.number().min(0).max(6),
        enabled: z.boolean(),
        startTime: z.string(),
        endTime: z.string(),
      }),
    )
    .length(7)
    .transform((intervals) => intervals.filter((interval) => interval.enabled))
    .refine((intervals) => intervals.length > 0, {
      message: 'Selecione ao menos um dia da semana',
    })
    .transform((intervals) => {
      return intervals.map((interval) => {
        return {
          weekDay: interval.weekDay,
          startTimeInMinutes: convertTimeStringInMinutes(interval.startTime),
          endTimeInMinutes: convertTimeStringInMinutes(interval.endTime),
        }
      })
    })
    .refine(
      (intervals) => {
        return intervals.every(
          (interval) =>
            interval.endTimeInMinutes - 60 >= interval.startTimeInMinutes,
        )
      },
      {
        message:
          'O horário de t´rmino deve ser pelo menos 1h distante do início.',
      },
    ),
})

type timeIntervalsFormInput = z.input<typeof formSchema>
// type timeIntervalsFormOutput = z.output<typeof formSchema>

export default function TimeIntervals() {
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<timeIntervalsFormInput>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      intervals: [
        { weekDay: 0, enabled: false, startTime: '08:00', endTime: '18:00' },
        { weekDay: 1, enabled: true, startTime: '08:00', endTime: '18:00' },
        { weekDay: 2, enabled: true, startTime: '08:00', endTime: '18:00' },
        { weekDay: 3, enabled: true, startTime: '08:00', endTime: '18:00' },
        { weekDay: 4, enabled: true, startTime: '08:00', endTime: '18:00' },
        { weekDay: 5, enabled: true, startTime: '08:00', endTime: '18:00' },
        { weekDay: 6, enabled: false, startTime: '08:00', endTime: '18:00' },
      ],
    },
  })
  /**
   * exemplo
   * [
   *  {day:0, start:time, end:time}
   *  {day:1, start:time, end:time}
   *  {day:2, start:time, end:time}
   * ]
   *
   */

  const weekDays = getWeekDays()
  const intervals = watch('intervals')
  const router = useRouter()

  const { fields } = useFieldArray({
    control,
    name: 'intervals',
  })
  async function handleSetSubmitIntervals(obj) {
    console.log(obj)
    await api.post('/user/time-intervals', obj)

    await router.push('/register/update-profile')
  }

  return (
    <Container>
      <Header>
        <Heading as={'strong'}>Quase lá</Heading>
        <Text>
          Defina o intervalo de horarios que voce está disponivel em cada dia da
          semana.
        </Text>
        <MultiStep size={4} currentStep={3}></MultiStep>
      </Header>
      <IntervalBox
        as={'form'}
        onSubmit={handleSubmit(handleSetSubmitIntervals)}
      >
        <IntervalContainer>
          {fields.map((field, index) => {
            return (
              <IntervalItem key={field.id}>
                <IntervalDay>
                  <Controller
                    name={`intervals.${index}.enabled`}
                    control={control}
                    render={({ field }) => {
                      return (
                        <Checkbox
                          onCheckedChange={(checked) => {
                            field.onChange(checked === true)
                          }}
                          checked={field.value}
                        />
                      )
                    }}
                  />
                  <Text>{weekDays[field.weekDay]}</Text>
                </IntervalDay>
                <IntervalInputs>
                  <TextInput
                    size={'sm'}
                    type="time"
                    step={60}
                    disabled={intervals[index].enabled === false}
                    {...register(`intervals.${index}.startTime`)}
                  />
                  <TextInput
                    size={'sm'}
                    type="time"
                    step={60}
                    disabled={intervals[index].enabled === false}
                    {...register(`intervals.${index}.endTime`)}
                  />
                </IntervalInputs>
              </IntervalItem>
            )
          })}
        </IntervalContainer>

        {errors.intervals && (
          <FormError>{errors.intervals?.root?.message} </FormError>
        )}
        <Button type="submit" disabled={isSubmitting}>
          Proximo passo
          <ArrowRight />
        </Button>
      </IntervalBox>
    </Container>
  )
}