import { supabase } from './client'

// ========== TIPE ==========
type FetcherOptions<T> = {
  table: string
  select?: string
  filters?: Record<string, any>
  single?: boolean
  order?: { column: string; ascending?: boolean }
}

export type FetcherResult<T> = {
  data: T | null
  error: any | null
}

// ========== SELECT ==========
export async function supabaseFetcher<T>({
  table,
  select = '*',
  filters = {},
  single = false,
  order,
}: FetcherOptions<T>): Promise<FetcherResult<T>> {
  try {
    let query = supabase.from(table).select(select)

    Object.entries(filters).forEach(([key, value]) => {
      query = query.eq(key, value)
    })

    if (order) {
      query = query.order(order.column, { ascending: order.ascending ?? true })
    }

    if (single) {
      const { data, error } = await query.maybeSingle()
      if (error) return { data: null, error }
      return { data: data as T, error: null }
    } else {
      const { data, error } = await query
      if (error) return { data: null, error }
      return { data: data as T, error: null }
    }
  } catch (error) {
    console.error(`[Supabase Fetcher] Error on table "${table}":`, error)
    return { data: null, error }
  }
}

// ========== INSERT ==========
export async function supabaseInsert<T>(
  table: string,
  data: Record<string, any>
): Promise<FetcherResult<T>> {
  try {
    const { data: result, error } = await supabase
      .from(table)
      .insert(data)
      .select()

    if (error) return { data: null, error }
    return { data: result?.[0] as T, error: null }
  } catch (error) {
    console.error(`[Supabase Insert] Error on table "${table}":`, error)
    return { data: null, error }
  }
}