#pragma once

/** Configures jemalloc.
 * Should be included before `main()`
 *
 * See: http://jemalloc.net/jemalloc.3.html#tuning
 * https://github.com/jemalloc/jemalloc/blob/dev/TUNING.md
 */
const char* malloc_conf = "background_thread:true,metadata_thp:auto,dirty_decay_ms:30000,muzzy_decay_ms:30000";
