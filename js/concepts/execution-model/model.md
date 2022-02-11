# 执行模型

非官方术语 Execution Model

### jobs

1.  spec 8.4 jobs & jobs queues

Jobs are enqueued on the job queues, and in current spec version there are two job queues: ScriptJobs, and PromiseJobs.

And initial job on the ScriptJobs queue is the main entry point to our program — initial script which is loaded and evaluated: a realm is created, a global context is created and is associated with this realm, it’s pushed onto the stack, and the global code is executed.

Notice, the ScriptJobs queue manages both, scripts and modules.

event loop https://gist.github.com/DmitrySoshnikov/26e54990e7df8c3ae7e6e149c87883e4
