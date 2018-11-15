const base_url = 'http://127.0.0.1:8000'

export const endpoints = {
  poll_list:      ()                  => `${base_url}/api/polls/`,
  poll_detail:    (pollId)            => `${base_url}/api/polls/${pollId}/`,
  choice_list:    (pollId)            => `${base_url}/api/polls/${pollId}/choices/`,
  vote:           (pollId, choiceId)  => `${base_url}/api/polls/${pollId}/choices/${choiceId}/vote/`,
  user_poll_list: (username)          => `${base_url}/api/${username}/polls/`
}
