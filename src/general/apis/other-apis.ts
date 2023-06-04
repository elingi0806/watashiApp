import util from '../utility';
/**
 *  jokeAPI呼び出し(外部API呼び出し)
 */
async function SayJoke() {
  const url = 'https://official-joke-api.appspot.com/jokes/random';
  const response = await useFetch(url);
  const formatResponse = util.formatResponse(response);
  return formatResponse;
}
/**
 *  天気予報取得(外部API呼び出し)
 */
async function GetWeather() {
  // 取得先のURL
  const url =
    'https://api.open-meteo.com/v1/forecast?latitude=35.6785&longitude=139.6823&hourly=weathercode&timezone=Asia%2FTokyo';
  // リクエスト（Get）
  const response = await useFetch(url);
  const formatResponse = util.formatResponse(response);
  return formatResponse;
}

export default { SayJoke, GetWeather };
