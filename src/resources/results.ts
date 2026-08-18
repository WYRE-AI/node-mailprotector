import { API_PREFIX } from '../config.js';
import type { HttpClient } from '../http.js';
import type { ResultCodeInfo, ResultCodeQuery } from '../types/index.js';

/** Filtering-result-code documentation lookup (codes appear in `LogEntry.results_data`). */
export class ResultsResource {
  constructor(private readonly http: HttpClient) {}

  async findByCode(query: ResultCodeQuery): Promise<ResultCodeInfo> {
    return this.http.request(`${API_PREFIX}/results`, { method: 'POST', body: query });
  }
}
