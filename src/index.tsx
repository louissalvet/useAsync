import { useState, useCallback } from 'react'

type AsyncReturnType<T extends (...args: any) => any> = T extends (
  ...args: any
) => Promise<infer U>
  ? U
  : T extends (...args: any) => infer U
  ? U
  : any

const useAsync = <R extends (...args: any) => Promise<any>>(
  asyncFunction: R
) => {
  type Data = AsyncReturnType<typeof asyncFunction>

  const [data, setData] = useState<Data | null>(null)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)
  const [called, setCalled] = useState(false)

  type Arguments = Parameters<typeof asyncFunction>

  const triggerRequest = useCallback(
    async (...args: Arguments) => {
      setLoading(true)
      try {
        const data = await asyncFunction(args)
        setData(data)
      } catch {
        setError(true)
      } finally {
        setCalled(true)
        setLoading(false)
      }
    },
    [asyncFunction]
  )

  return [triggerRequest, { data, loading, error, called }] as const
}

export default useAsync
