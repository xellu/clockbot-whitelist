<script lang="ts">
    import { onMount } from "svelte";
    import { slide } from "svelte/transition";
    import { Accordion, AccordionItem, InputChip } from '@skeletonlabs/skeleton';

    import { toIn } from "$lib/scripts/Utils";

    import Embed from "$lib/components/Embed.svelte";
    import UcHeading from "$lib/components/UCHeading.svelte";
    import Separator from "$lib/components/Separator.svelte";
    import Loader from "$lib/components/Loader.svelte";

    const altApplyUrl = "https://docs.google.com/forms/d/e/1FAIpQLSeAsbl9IBkYlRPqqAZEJCFZJ7AQ9tIzVKG0qWlgqkmR_C-E5w/viewform?usp=dialog";
    const discordOAuthUrl = "https://discord.com/oauth2/authorize?client_id=1363733842057236511&response_type=code&redirect_uri=https%3A%2F%2Fclockapi.catboys.cc%2Fclockwork&scope=identify";

    const form: {minecraft: string, discord: number,
            answers: {age: null | string, region: null | string, howFound: string[], whyJoin: null | string,
                playedSMPs: boolean | null, playedCreate: boolean | null, goodAt: string[], joinTown: string | null, friendsPlaying: string[], note: string | null}} = {

        minecraft: "",
        discord: 0,

        answers: {
            age: null,
            region: null,
            howFound: [],
            whyJoin: null,
            playedSMPs: null,
            playedCreate: null,
            goodAt: [],
            joinTown: null,
            friendsPlaying: [],
            note: null
        }
    }
    let hasFriends: boolean = false;

    let disData: {loading: boolean, valid: boolean, id: number, username: string, avatar: string, error?: string} = {loading: true, valid: false, id: 0, username: "", avatar: ""};
    let disError: {message: string | null, reapply_in: number} = {message: null, reapply_in: 0};

    let mcData: {loading: boolean, valid: boolean, uuid: string} = {loading: false, valid: false, uuid: ""};
    async function checkMC() {
        mcData.loading = true;

        try {
            if (form.minecraft.length < 3 || form.minecraft.length > 17) {
                mcData.valid = false;
                mcData.loading = false;
                mcData.uuid = "";
                return;
            }

            let r = await fetch(`/api/v1/mc-profile?username=${form.minecraft}`);
            if (r.status == 200) {
                let data = await r.json();
                mcData.loading = false;
                mcData.valid = true;
                mcData.uuid = data.uuid;
                return
            }

            mcData.valid = false;
        } catch (e) {
            mcData.valid = false;
            mcData.loading = false;
            mcData.uuid = "";
        } finally {
            mcData.loading = false;
        }
    }

    let state: {loading: boolean, error: null | string} = {
        loading: false,
        error: null
    }

    const usernameChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_";
    let page: number = 0;
    function nextPage() {
        if (page < 5) page++;
    }
    function prevPage() {
        if (page > 0) page--;
    }

    onMount(async () => {
        let code = new URLSearchParams(window.location.search).get("code");
        if (!code) {
            disData.loading = false
            return;
        }

        //load discord account data
        try {
            let r = await fetch(`/api/v1/discord`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    code: code
                })
            });
            if (r.status == 200) {
                let data = await r.json();
                disData.loading = false;
                
                disData.valid = true;
                disData.id = data.id;
                disData.username = data.username;
                disData.avatar = data.avatar;
            } else if (r.status == 429) {
                let data = await r.json();
                disData.loading = false;

                disData.error = data.error;
                disError.message = data.error;
                disError.reapply_in = data.reapply_in*1000;
            } else {
                disData.loading = false;

                try {
                    let data = await r.json();
                    disData.error = data.error || "Unknown error";
                } catch (e) {} //pass
            }
        } catch (e) {
            disData.loading = false;
        }	
    })

    async function submit() {
        state.loading = true;
        state.error = null;

        try {
            let r = await fetch("/api/v1/apply", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    discord: disData.id,
                    minecraft: mcData.uuid,
                    answers: form.answers
                })
            });

            page = 6;
            if (r.status == 200) {
                state.loading = false;
            } else {
                let data = await r.json();
                state.loading = false;
                state.error = data.error; 
            }
        } catch (e: any) {
            state.loading = false;
            state.error = e.message || "Unknown error";
        }
    }
</script>

<Embed
    title = "Backtank SMP - Apply for Whitelist"
    icon = "default"
    route = "/clockwork"
/>

<div class="min-h-screen py-64 flex items-center justify-center p-3">
    <div class="flex flex-col glass p-5 rounded-2xl max-w-lg">
        <UcHeading>Backtank SMP</UcHeading>
        <p class="text-sm opacity-70 py-3">Welcome to the Backtank SMP! In order to get whitelisted, please fill out the form below.</p>
    
        <Accordion>
            <AccordionItem>
                <svelte:fragment slot="lead"><span class="material-symbols-outlined text-error-500 mt-1.5">help</span></svelte:fragment>
                <svelte:fragment slot="summary"><span class="text-error-500">Having Issues?</span></svelte:fragment>
                <svelte:fragment slot="content">
                    <p class="text-sm pb-3">
                        If you're unable to submit the form, consider checking your internet connection or trying a different browser. If the issue persists,
                        you may fill out the <a href="{altApplyUrl}" class="text-secondary-500 underline" target="_blank">Google Form</a> instead. This form is a backup option and isn't checked as frequently.
                        <br><br>
                        If you have any questions or need assistance, feel free to reach out to us on Discord. We're here to help!
                    </p>
                </svelte:fragment>
            </AccordionItem>
        </Accordion>

        
        {#if page == 0} 
            <!-- discord -->
            <div transition:slide>
                <Separator>Discord</Separator>
                {#if disData.loading}
                    <div transition:slide><Loader variant="tertiary" /></div>
                {:else if !disData.valid}
                    {#if disData.error}
                        {#if !disError.message}
                            <div class="flex gap-2 mb-3 text-error-500 text-sm items-center">
                                <span class="material-symbols-outlined">error</span>
                                <p class="font-bold uppercase">Login Failed:</p>
                                <p>{disData.error}</p>
                            </div>

                            <a href="{discordOAuthUrl}" transition:slide>
                                <button class="btn bg-[#5662f6] flex gap-3 items-center w-full">
                                    <img src="/discord.png" alt="" class="w-6">
                                    Login to Continue
                                </button>
                            </a>
                        {:else}
                            <div class="w-full flex flex-col items-center">
                                <span class="material-symbols-outlined text-error-500 text-3xl">error</span>
                                <p class="mt-5 text-error-500 text-center">{disError.message}</p>
                            

                                {#if disError.reapply_in > 0}
                                    <p class="text-sm mt-5 opacity-70">You may reapply {toIn(disError.reapply_in)}</p>
                                {/if}

                            </div>
                        {/if}
                    {:else}
                        <a href="{discordOAuthUrl}" transition:slide>
                            <button class="btn bg-[#5662f6] flex gap-3 items-center w-full">
                                <img src="/discord.png" alt="" class="w-6">
                                Login to Continue
                            </button>
                        </a>
                    {/if}
                {:else}
                    <div class="flex gap-3 items-center">
                        <img src="https://cdn.discordapp.com/avatars/{disData.id}/{disData.avatar}.webp" alt="" class="w-12 rounded-full">
                        <div class="flex flex-col">
                            <p class="text-xs uppercase">Logged in as</p>
                            <p class="font-bold">{disData.username}</p>
                        </div>

                        <div class="flex-grow"></div>
                        <a href="{discordOAuthUrl}" transition:slide>
                            <button class="btn btn-sm bg-[#5662f6] flex gap-3 items-center w-full h-8">
                                <img src="/discord.png" alt="" class="w-6">
                                Change
                            </button>
                        </a>
                        <button class="btn btn-sm glass-tertiary h-8"
                            on:click={() => {
                                if (disData.valid) {
                                    nextPage();
                                }
                        }}>
                            Next
                        </button>
                    </div>
                {/if}
                <!-- <p>valid: {disData.valid}, loading: {disData.loading}, error: {disError.message}</p> -->
            </div>
        {:else if page == 1}
            <div transition:slide>
                <Separator>Minecraft</Separator>
                <!-- minecraft -->
                <div class="flex gap-5">
                    <div class="w-24 h-24 flex items-center justify-center">
                        {#if mcData.loading}                
                            <Loader variant="tertiary" />
                        {:else}
                            <img src="https://mc-heads.net/body/{mcData.uuid || 'None'}" alt="{form.minecraft}" class="h-24">
                        {/if}
                    </div>

                    <div class="flex-grow flex flex-col gap-3">
                        <input type="text" placeholder="Your Username" bind:value={form.minecraft} class="w-full glass-input" on:change={() => {
                            checkMC();
                        }} />
                        

                        <div class="flex gap-3">
                            <button class="btn btn-sm glass flex-grow"
                                on:click={() => {
                                    prevPage();
                                }}
                            >
                                Back
                            </button>
                            <button class="btn btn-sm glass-tertiary flex-grow"
                                disabled={mcData.loading || !mcData.valid}
                                on:click={() => {
                                    if (mcData.valid) {
                                        nextPage();
                                    }
                                }}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>   
            </div> 
        {:else if page == 2}
        <div transition:slide class="flex flex-col gap-3 select-none">
            <Separator>About You</Separator>

            <div>
                <p class="text-sm font-bold">How old are you?</p>
                <div class="flex flex-col p-1">
                    <label class="flex items-center">
                        <input class="radio glass-checkbox" type="radio" checked name="age" value="13 or younger" bind:group={form.answers.age} />
                        <p class="px-2">13 or younger</p>
                    </label>
                    <label class="flex items-center">
                        <input class="radio glass-checkbox" type="radio" name="age" value="14-15" bind:group={form.answers.age} />
                        <p class="px-2">14-15</p>
                    </label>
                    <label class="flex items-center">
                        <input class="radio glass-checkbox" type="radio" name="age" value="16-17" bind:group={form.answers.age} />
                        <p class="px-2">16-17</p>
                    </label>
                    <label class="flex items-center">
                        <input class="radio glass-checkbox" type="radio" name="age" value="18 or older" bind:group={form.answers.age} />
                        <p class="px-2">18 or older</p>
                    </label>
                </div>
            </div>

            <div>
                <p class="text-sm font-bold">Where are you from?</p>
                <div class="flex flex-col p-1">
                    <label class="flex items-center">
                        <input class="radio glass-checkbox" type="radio" checked name="region" value="Europe" bind:group={form.answers.region} />
                        <p class="px-2">Europe</p>
                    </label>
                    <label class="flex items-center">
                        <input class="radio glass-checkbox" type="radio" checked name="region" value="Asia" bind:group={form.answers.region} />
                        <p class="px-2">Asia</p>
                    </label>
                    <label class="flex items-center">
                        <input class="radio glass-checkbox" type="radio" checked name="region" value="North America" bind:group={form.answers.region} />
                        <p class="px-2">North America</p>
                    </label>
                    <label class="flex items-center">
                        <input class="radio glass-checkbox" type="radio" checked name="region" value="South America" bind:group={form.answers.region} />
                        <p class="px-2">South America</p>
                    </label>
                    <label class="flex items-center">
                        <input class="radio glass-checkbox" type="radio" checked name="region" value="Oceania" bind:group={form.answers.region} />
                        <p class="px-2">Oceania</p>
                    </label>
                    <label class="flex items-center">
                        <input class="radio glass-checkbox" type="radio" checked name="region" value="Africa" bind:group={form.answers.region} />
                        <p class="px-2">Africa</p>
                    </label>
                </div>
            </div>

            <div>
                <p class="text-sm font-bold">How did you find out about us?</p>
                <div class="flex flex-col p-1">
                    <label class="flex items-center">
                        <input class="checkbox glass-checkbox" type="checkbox" value="Reddit" on:change={() => {
                            if (form.answers.howFound.includes("Reddit")) { form.answers.howFound = form.answers.howFound.filter((e) => e != "Reddit");
                            } else { form.answers.howFound = [...form.answers.howFound, "Reddit"]; }
                        }} />
                        <p class="px-2">Reddit</p>
                    </label>
                    <label class="flex items-center">
                        <input class="checkbox glass-checkbox" type="checkbox" value="Google Search" on:change={() => {
                            if (form.answers.howFound.includes("Google Search")) { form.answers.howFound = form.answers.howFound.filter((e) => e != "Google Search");
                            } else { form.answers.howFound = [...form.answers.howFound, "Google Search"]; }
                        }} />
                        <p class="px-2">Google Search</p>
                    </label>
                    <label class="flex items-center">
                        <input class="checkbox glass-checkbox" type="checkbox" value="Discord" on:change={() => {
                            if (form.answers.howFound.includes("Discord")) { form.answers.howFound = form.answers.howFound.filter((e) => e != "Discord");
                            } else { form.answers.howFound = [...form.answers.howFound, "Discord"]; }
                        }} />
                        <p class="px-2">Discord</p>
                    </label>
                    <label class="flex items-center">
                        <input class="checkbox glass-checkbox" type="checkbox" value="Friend" on:change={() => {
                            if (form.answers.howFound.includes("Friend")) { form.answers.howFound = form.answers.howFound.filter((e) => e != "Friend");
                            } else { form.answers.howFound = [...form.answers.howFound, "Friend"]; }
                        }} />
                        <p class="px-2">Friend</p>
                    </label>
                    <label class="flex items-center">
                        <input class="checkbox glass-checkbox" type="checkbox" value="Other" on:change={() => {
                            if (form.answers.howFound.includes("Other")) { form.answers.howFound = form.answers.howFound.filter((e) => e != "Other");
                            } else { form.answers.howFound = [...form.answers.howFound, "Other"]; }
                        }} />
                        <p class="px-2">Other</p>
                    </label>
                </div>                
            </div>

            <div class="flex items-center gap-3">
                <button class="btn btn-sm glass flex-grow" on:click={prevPage}>
                    Back
                </button>
                <button class="btn btn-sm glass-tertiary flex-grow"
                    disabled={!form.answers.age || !form.answers.region || form.answers.howFound.length == 0}
                    on:click={() => {
                        if (form.answers.age && form.answers.region && form.answers.howFound.length > 0) {
                            hasFriends = form.answers.howFound.includes("Friend")

                            nextPage();
                        }
                }}>
                    Next
                </button>
            </div>

        </div>
        {:else if page == 3}
        <div transition:slide class="flex flex-col gap-3 select-none">
            <Separator>Additional Questions</Separator>
            <div>
                <p class="text-sm font-bold">What Interests you about this SMP?</p>
                <textarea class="glass-input w-full resize-y max-h-64 min-h-8 h-24" placeholder="Your answer..." maxlength="450" bind:value={form.answers.whyJoin}></textarea>
            </div>

            <div>
                <p class="text-sm font-bold">Have you played on any other SMPs?</p>
                <label class="flex items-center">
                    <input class="radio glass-checkbox" type="radio" name="smp" value={true} bind:group={form.answers.playedSMPs} />
                    <p class="px-2">Yes</p>
                </label>
                <label class="flex items-center">
                    <input class="radio glass-checkbox" type="radio" name="smp" value={false} bind:group={form.answers.playedSMPs} />
                    <p class="px-2">No</p>
                </label>
            </div>

            <div>
                <p class="text-sm font-bold">Have you played with Create Mod before?</p>
                <label class="flex items-center">
                    <input class="radio glass-checkbox" type="radio" name="create" value={true} bind:group={form.answers.playedCreate} />
                    <p class="px-2">Yes</p>
                </label>
                <label class="flex items-center">
                    <input class="radio glass-checkbox" type="radio" name="create" value={false} bind:group={form.answers.playedCreate} />
                    <p class="px-2">No</p>
                </label>
            </div>

            <div class="flex items-center gap-3">
                <button class="btn btn-sm glass flex-grow" on:click={prevPage}>
                    Back
                </button>
                <button class="btn btn-sm glass-tertiary flex-grow"
                    disabled = {form.answers.playedCreate == null || form.answers.playedSMPs == null || (form.answers.whyJoin || '').length < 5}
                    on:click={() => {
                        if (form.answers.playedCreate == null || form.answers.playedSMPs == null || (form.answers.whyJoin || '').length < 5) {
                            return;
                        }

                        nextPage();
                }}>
                    Next
                </button>
            </div>
        </div>
        {:else if page == 4}
        <div transition:slide class="flex flex-col gap-3 select-none">
            <Separator>Community Integration</Separator>
            <div>
                <p class="text-sm font-bold">What are you good at? </p>
                <div class="flex flex-col p-1">
                    <!-- building -->
                    <label class="flex items-center">
                        <input class="checkbox glass-checkbox" type="checkbox" value="Building" on:change={() => {
                            if (form.answers.goodAt.includes("Building")) { form.answers.goodAt = form.answers.goodAt.filter((e) => e != "Building");
                            } else { form.answers.goodAt = [...form.answers.goodAt, "Building"] }
                        }} />
                        <p class="px-2">Building, Design</p>
                    </label>
                    <!-- engineering -->
                    <label class="flex items-center">
                        <input class="checkbox glass-checkbox" type="checkbox" value="Engineering" on:change={() => {
                            if (form.answers.goodAt.includes("Engineering")) { form.answers.goodAt = form.answers.goodAt.filter((e) => e != "Engineering");
                            } else { form.answers.goodAt = [...form.answers.goodAt, "Engineering"] }
                        }} />
                        <p class="px-2">Engineering (create mod, redstone, etc.)</p>
                    </label>
                    <!-- leadership -->
                    <label class="flex items-center">
                        <input class="checkbox glass-checkbox" type="checkbox" value="Leadership" on:change={() => {
                            if (form.answers.goodAt.includes("Leadership")) { form.answers.goodAt = form.answers.goodAt.filter((e) => e != "Leadership");
                            } else { form.answers.goodAt = [...form.answers.goodAt, "Leadership"]; }
                        }} />
                        <p class="px-2">Leadership, Management</p>
                    </label>
                    <!-- exploration -->
                    <label class="flex items-center">
                        <input class="checkbox glass-checkbox" type="checkbox" value="Exploration" on:change={() => {
                            if (form.answers.goodAt.includes("Exploration")) { form.answers.goodAt = form.answers.goodAt.filter((e) => e != "Exploration");
                            } else { form.answers.goodAt = [...form.answers.goodAt, "Exploration"]; }
                        }} />
                        <p class="px-2">Exploration</p>
                    </label>
                </div>
            </div>

            <div>
                <p class="text-sm font-bold">Do you want to be a part of any town/city? </p>
                <label class="flex items-center">
                    <input class="radio glass-checkbox" type="radio" name="town" value="yes (join)" bind:group={form.answers.joinTown} />
                    <p class="px-2">Yes - I want to join an existing town</p>
                </label>
                <label class="flex items-center">
                    <input class="radio glass-checkbox" type="radio" name="town" value="yes (create)" bind:group={form.answers.joinTown} />
                    <p class="px-2">Yes - I want to create a new town</p>
                </label>
                <label class="flex items-center">
                    <input class="radio glass-checkbox" type="radio" name="town" value="no" bind:group={form.answers.joinTown} />
                    <p class="px-2">No</p>
                </label>
            </div>

            <div>
                <p class="text-sm font-bold">Do you have any friends playing on the server? {#if !hasFriends}<span class="opacity-50 font-normal">(optional)</span>{/if}</p>
                <InputChip
                    bind:value={form.answers.friendsPlaying}
                    name="friends"
                    placeholder="Enter a player name"
                    
                    maxlength={17}
                    minlength={3}
                    allowDuplicates={false}
                    validation={(value) => {
                        if (value.length < 3 || value.length > 17) {
                            return false;
                        }
                        for (let i = 0; i < value.length; i++) {
                            if (!usernameChars.includes(value[i])) {
                                return false;
                            }
                        }

                        return true;
                    }}
                />
            </div>

            <div class="flex items-center gap-3">
                <button class="btn btn-sm glass flex-grow" on:click={prevPage}>
                    Back
                </button>
                <button class="btn btn-sm glass-tertiary flex-grow"
                    disabled={!form.answers.goodAt.length || !form.answers.joinTown || (hasFriends && !form.answers.friendsPlaying)}
                    on:click={() => {
                        if (hasFriends && !form.answers.friendsPlaying) { return; }
                        if (form.answers.goodAt.length > 0 && form.answers.joinTown) {
                            nextPage();
                        }
                }}>
                    Next
                </button>
            </div>
        </div>
        {:else if page == 5}
        <div transition:slide class="flex flex-col gap-3 select-none">
            <Separator>Additional Notes</Separator>
            <div>
                <p class="text-sm font-bold">Anything else you'd like us to know? <span class="opacity-50 font-normal">(optional)</span></p>
                <textarea class="glass-input w-full resize-y max-h-64 min-h-8 h-24" placeholder="Your answer..." maxlength="450" bind:value={form.answers.note}></textarea>
            </div>

            <div class="flex items-center gap-3">
                <button class="btn btn-sm glass flex-grow" on:click={prevPage}>
                    Back
                </button>
                <button class="btn btn-sm glass-tertiary flex-grow"
                    disabled={state.loading}
                    on:click={submit}>
                    {#if state.loading} <Loader scale="xs" variant="tertiary" /> {:else} Submit {/if}
                </button>
            </div>
        </div>
        {:else if page == 6}
        <div transition:slide>
            {#if state.error == null}
                <Separator>Thank you!</Separator>
                <p class="text-sm text-success-500">Your application has been submitted! We will review it and get back to you as soon as possible.</p>
                <br>
                <p class="text-sm">If you have any questions, feel free to reach out to us on Discord.</p>
            {:else}
                <Separator>Application Failed</Separator>
                <p class="text-sm text-error-500">Your application could not be submitted. Please try again later.</p>
                <p class="text-sm text-error-500">Error: {state.error}</p>

                <button class="btn btn-sm glass-error" on:click={() => { 
                    for (let i = 0; i < 7; i++) {
                        setTimeout(() => {
                            prevPage();
                        }, 150 * i);
                    }
                 }}>
                    Retry
                </button>
            {/if}
        </div>
        {/if}
    
    </div>
</div>