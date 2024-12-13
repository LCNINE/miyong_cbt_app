import { SupabaseClient } from '@supabase/supabase-js'
import { Database } from '../src/type/database.types'

abstract class Service {
  protected supabase: SupabaseClient<Database>

  constructor(supabase: SupabaseClient<Database>) {
    this.supabase = supabase
  }
}

export default Service
