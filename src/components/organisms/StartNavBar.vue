<template>
  <header class="w-full bg-black border-b border-gray-50 shadow-sm z-10">
    <div class="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

      <div class="flex items-center gap-2">
        <div class="w-9 h-9 rounded-xl flex items-center justify-center overflow-hidden">
          <img src="../../assets/logo.png" alt="Logo" class="w-full h-full object-cover" />
        </div>
        <span class="text-2xl font-extrabold tracking-tighter text-white">
            ZGRZYT
        </span>
      </div>

      <LangSwitcher />

      <div class="hidden md:block text-xs font-bold text-white bg-violet-950 px-2 py-2 rounded-full">
        v0.1.0-alpha
      </div>

    </div>
  </header>
</template>