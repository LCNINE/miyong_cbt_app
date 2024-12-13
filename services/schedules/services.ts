import Service from "../Service";

export default class ScheduleServices extends Service {
  public async getSchedules (){
    const {data, error} = await this.supabase.from('exam_schedules').select('*')

    if(error){
      console.error('[ScheduleServices.getSchedules.error]', error)
      throw error
    }

    return data
  }
}