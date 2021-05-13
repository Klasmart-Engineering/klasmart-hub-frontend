import { organizationProgram } from "@/components/Program/Table";
import { Program } from "@/types/graphQL";

const programA: Program = {
    id: `7a8c5021-142b-44b1-b60b-275c29d132fe`,
    name: `Bada Read`,
    status: `active`,
    system: true,
    age_ranges: [
        {
            id: `fe0b81a4-5b02-4548-8fb0-d49cd4a4604a`,
            name: `5 - 6 year(s)`,
            high_value: 6,
            high_value_unit: `year`,
            low_value: 5,
            low_value_unit: `year`,
            status: `active`,
            system: true,
        },
        {
            id: `21f1da64-b6c8-4e74-9fef-09d08cfd8e6c`,
            name: `7 - 8 year(s)`,
            high_value: 8,
            high_value_unit: `year`,
            low_value: 7,
            low_value_unit: `year`,
            status: `active`,
            system: true,
        },
        {
            id: `7965d220-619d-400f-8cab-42bd98c7d23c`,
            name: `3 - 4 year(s)`,
            high_value: 4,
            high_value_unit: `year`,
            low_value: 3,
            low_value_unit: `year`,
            status: `active`,
            system: true,
        },
        {
            id: `bb7982cd-020f-4e1a-93fc-4a6874917f07`,
            name: `4 - 5 year(s)`,
            high_value: 5,
            high_value_unit: `year`,
            low_value: 4,
            low_value_unit: `year`,
            status: `active`,
            system: true,
        },
    ],
    subjects: [
        {
            id: `b997e0d1-2dd7-40d8-847a-b8670247e96b`,
            name: `Language/Literacy`,
            status: `active`,
            system: true,
            categories: [
                {
                    id: `64e000aa-4a2c-4e2e-9d8d-f779e97bdd73`,
                    name: `Speech & Language Skills`,
                    status: `active`,
                    subcategories: [
                        {
                            id: `8b955cbc-6808-49b2-adc0-5bec8b59f4fe`,
                            name: `Phonics`,
                            status: `active`,
                        },
                        {
                            id: `2b6b5d54-0243-4c7e-917a-1627f107f198`,
                            name: `Speaking & Listening`,
                            status: `active`,
                        },
                        {
                            id: `2d1152a3-fb03-4c4e-aeba-98856c3241bd`,
                            name: `Vocabulary`,
                            status: `active`,
                        },
                        {
                            id: `3fca3a2b-97b6-4ec9-a5b1-1d0ef5f1b445`,
                            name: `Reading Skills and Comprehension`,
                            status: `active`,
                        },
                        {
                            id: `9a9882f1-d890-461c-a710-ca37fb78ddf5`,
                            name: `Sight Words`,
                            status: `active`,
                        },
                        {
                            id: `0fd7d721-df1b-41eb-baa4-08ba4ac2b2e7`,
                            name: `Thematic Concepts`,
                            status: `active`,
                        },
                    ],
                },
                {
                    id: `59c47920-4d0d-477c-a33b-06e7f13873d7`,
                    name: `Fine Motor Skills`,
                    status: `active`,
                    subcategories: [
                        {
                            id: `bf89c192-93dd-4192-97ab-f37198548ead`,
                            name: `Hand-Eye Coordination`,
                            status: `active`,
                        },
                        {
                            id: `963729a4-7853-49d2-b75d-2c61d291afee`,
                            name: `Sensory`,
                            status: `active`,
                        },
                    ],
                },
                {
                    id: `7e887129-1e7d-40dc-8caa-5e1e0197fb4d`,
                    name: `Gross Motor Skills`,
                    status: `active`,
                    subcategories: [
                        {
                            id: `f78c01f9-4b8a-480c-8c4b-80d1ec1747a7`,
                            name: `Complex Movements`,
                            status: `active`,
                        },
                        {
                            id: `f5a1e3a6-c0b1-4b2f-991f-9df7897dac67`,
                            name: `Physical Skills`,
                            status: `active`,
                        },
                        {
                            id: `bd7adbd0-9ce7-4c50-aa8e-85b842683fb5`,
                            name: `Simple Movements`,
                            status: `active`,
                        },
                    ],
                },
                {
                    id: `9e35379a-c333-4471-937e-ac9eeb89cc77`,
                    name: `Cognitive Skills`,
                    status: `active`,
                    subcategories: [
                        {
                            id: `f385c1ec-6cfa-4f49-a219-fd28374cf2a6`,
                            name: `Visual`,
                            status: `active`,
                        },
                        {
                            id: `b32321db-3b4a-4b1e-8db9-c485d045bf01`,
                            name: `Logic & Memory`,
                            status: `active`,
                        },
                    ],
                },
                {
                    id: `5c75ab94-c4c8-43b6-a43b-b439f449a7fb`,
                    name: `Personal Development`,
                    status: `active`,
                    subcategories: [
                        {
                            id: `ba77f705-9087-4424-bff9-50fcd0b1731e`,
                            name: `Social Skills`,
                            status: `active`,
                        },
                        {
                            id: `824bb6cb-0169-4335-b7a5-6ece2b929da3`,
                            name: `Emotional Skills`,
                            status: `active`,
                        },
                    ],
                },
                {
                    id: `ae82bafe-6513-4288-8951-18d93c07e3f1`,
                    name: `Oral Language`,
                    status: `active`,
                    subcategories: [
                        {
                            id: `843e4fea-7f4d-4746-87ff-693f5a44b467`,
                            name: `Communication`,
                            status: `active`,
                        },
                        {
                            id: `b2cc7a69-4e64-4e97-9587-0078dccd845a`,
                            name: `Language Support`,
                            status: `active`,
                        },
                        {
                            id: `2d1152a3-fb03-4c4e-aeba-98856c3241bd`,
                            name: `Vocabulary`,
                            status: `active`,
                        },
                    ],
                },
                {
                    id: `c68865b4-2ba3-4608-955c-dcc098291159`,
                    name: `Literacy`,
                    status: `active`,
                    subcategories: [
                        {
                            id: `a7850bd6-f5fd-4016-b708-7b823784ef0a`,
                            name: `Writing`,
                            status: `active`,
                        },
                        {
                            id: `01191172-b276-449f-ab11-8e66e990941e`,
                            name: `Reading`,
                            status: `active`,
                        },
                    ],
                },
                {
                    id: `61f517d8-2c2e-47fd-a2de-6e86465abc59`,
                    name: `Whole-Child`,
                    status: `active`,
                    subcategories: [
                        {
                            id: `96f81756-70e3-41e5-9143-740376574e35`,
                            name: `Social-Emotional Learning`,
                            status: `active`,
                        },
                        {
                            id: `0e6b1c2b-5e2f-47e1-8422-2a183f3e15c7`,
                            name: `Cognitive Development`,
                            status: `active`,
                        },
                        {
                            id: `144a3478-1946-4460-a965-0d7d74e63d65`,
                            name: `Physical Coordination`,
                            status: `active`,
                        },
                    ],
                },
                {
                    id: `26e4aedc-2222-44e1-a375-388b138c695d`,
                    name: `Knowledge`,
                    status: `active`,
                    subcategories: [
                        {
                            id: `49e73e4f-8ffc-47e3-9b87-0f9686d361d7`,
                            name: `Technology`,
                            status: `active`,
                        },
                        {
                            id: `852c3495-1ced-4580-a584-9d475217f3d5`,
                            name: `Character Education`,
                            status: `active`,
                        },
                        {
                            id: `cd06e622-a323-40f3-8409-5384395e00d2`,
                            name: `Science`,
                            status: `active`,
                        },
                        {
                            id: `81b09f61-4509-4ce0-b099-c208e62870f9`,
                            name: `Math`,
                            status: `active`,
                        },
                        {
                            id: `6fb79402-2fb6-4415-874c-338c949332ed`,
                            name: `Art`,
                            status: `active`,
                        },
                        {
                            id: `5b405510-384a-4721-a526-e12b3cbf2092`,
                            name: `Engineering`,
                            status: `active`,
                        },
                        {
                            id: `9a52fb0a-6ce8-45df-92a0-f25b5d3d2344`,
                            name: `Music`,
                            status: `active`,
                        },
                        {
                            id: `4114f381-a7c5-4e88-be84-2bef4eb04ad0`,
                            name: `Health`,
                            status: `active`,
                        },
                        {
                            id: `f4b07251-1d67-4a84-bcda-86c71cbf9cfd`,
                            name: `Social Studies`,
                            status: `active`,
                        },
                        {
                            id: `3b148168-31d0-4bef-9152-63c3ff516180`,
                            name: `Miscellaneous`,
                            status: `active`,
                        },
                    ],
                },
            ],
        },
    ],
    grades: [
        {
            id: `98461ca1-06a1-432a-97d0-4e1dff33e1a5`,
            name: `None Specified`,
            status: `active`,
            system: true,
        },
    ],
};

const programB: Program = {
    id: `93f293e8-2c6a-47ad-bc46-1554caac99e4`,
    name: `Bada Rhyme`,
    status: `active`,
    system: true,
    age_ranges: [
        {
            id: `fe0b81a4-5b02-4548-8fb0-d49cd4a4604a`,
            name: `5 - 6 year(s)`,
            high_value: 6,
            high_value_unit: `year`,
            low_value: 5,
            low_value_unit: `year`,
            status: `active`,
            system: true,
        },
        {
            id: `7965d220-619d-400f-8cab-42bd98c7d23c`,
            name: `3 - 4 year(s)`,
            high_value: 4,
            high_value_unit: `year`,
            low_value: 3,
            low_value_unit: `year`,
            status: `active`,
            system: true,
        },
        {
            id: `bb7982cd-020f-4e1a-93fc-4a6874917f07`,
            name: `4 - 5 year(s)`,
            high_value: 5,
            high_value_unit: `year`,
            low_value: 4,
            low_value_unit: `year`,
            status: `active`,
            system: true,
        },
    ],
    subjects: [
        {
            id: `49c8d5ee-472b-47a6-8c57-58daf863c2e1`,
            name: `Language/Literacy`,
            status: `active`,
            system: true,
            categories: [
                {
                    id: `bf1cd84d-da71-4111-82c6-e85224ab85ca`,
                    name: `Speech & Language Skills`,
                    status: `active`,
                    subcategories: [
                        {
                            id: `8b955cbc-6808-49b2-adc0-5bec8b59f4fe`,
                            name: `Phonics`,
                            status: `active`,
                        },
                        {
                            id: `2b6b5d54-0243-4c7e-917a-1627f107f198`,
                            name: `Speaking & Listening`,
                            status: `active`,
                        },
                        {
                            id: `2d1152a3-fb03-4c4e-aeba-98856c3241bd`,
                            name: `Vocabulary`,
                            status: `active`,
                        },
                        {
                            id: `3fca3a2b-97b6-4ec9-a5b1-1d0ef5f1b445`,
                            name: `Reading Skills and Comprehension`,
                            status: `active`,
                        },
                        {
                            id: `9a9882f1-d890-461c-a710-ca37fb78ddf5`,
                            name: `Sight Words`,
                            status: `active`,
                        },
                        {
                            id: `0fd7d721-df1b-41eb-baa4-08ba4ac2b2e7`,
                            name: `Thematic Concepts`,
                            status: `active`,
                        },
                    ],
                },
                {
                    id: `ba2db2b5-7f20-4cb7-88ef-cee0fcde7937`,
                    name: `Fine Motor Skills`,
                    status: `active`,
                    subcategories: [
                        {
                            id: `bf89c192-93dd-4192-97ab-f37198548ead`,
                            name: `Hand-Eye Coordination`,
                            status: `active`,
                        },
                        {
                            id: `963729a4-7853-49d2-b75d-2c61d291afee`,
                            name: `Sensory`,
                            status: `active`,
                        },
                    ],
                },
                {
                    id: `07786ea3-ac7b-43e0-bb91-6cd813318185`,
                    name: `Gross Motor Skills`,
                    status: `active`,
                    subcategories: [
                        {
                            id: `f78c01f9-4b8a-480c-8c4b-80d1ec1747a7`,
                            name: `Complex Movements`,
                            status: `active`,
                        },
                        {
                            id: `f5a1e3a6-c0b1-4b2f-991f-9df7897dac67`,
                            name: `Physical Skills`,
                            status: `active`,
                        },
                        {
                            id: `bd7adbd0-9ce7-4c50-aa8e-85b842683fb5`,
                            name: `Simple Movements`,
                            status: `active`,
                        },
                    ],
                },
                {
                    id: `c3f73955-26f0-49bf-91f7-8c42c81fb9d3`,
                    name: `Cognitive Skills`,
                    status: `active`,
                    subcategories: [
                        {
                            id: `f385c1ec-6cfa-4f49-a219-fd28374cf2a6`,
                            name: `Visual`,
                            status: `active`,
                        },
                        {
                            id: `b32321db-3b4a-4b1e-8db9-c485d045bf01`,
                            name: `Logic & Memory`,
                            status: `active`,
                        },
                    ],
                },
                {
                    id: `aebc88cd-0673-487b-a194-06e3958670a4`,
                    name: `Personal Development`,
                    status: `active`,
                    subcategories: [
                        {
                            id: `ba77f705-9087-4424-bff9-50fcd0b1731e`,
                            name: `Social Skills`,
                            status: `active`,
                        },
                        {
                            id: `824bb6cb-0169-4335-b7a5-6ece2b929da3`,
                            name: `Emotional Skills`,
                            status: `active`,
                        },
                    ],
                },
                {
                    id: `22520430-b13e-43ba-930f-fd051bbbc42a`,
                    name: `Oral Language`,
                    status: `active`,
                    subcategories: [
                        {
                            id: `b2cc7a69-4e64-4e97-9587-0078dccd845a`,
                            name: `Language Support`,
                            status: `active`,
                        },
                        {
                            id: `843e4fea-7f4d-4746-87ff-693f5a44b467`,
                            name: `Communication`,
                            status: `active`,
                        },
                        {
                            id: `5bb19c81-9261-428e-95ed-c87cc9f0560b`,
                            name: `Phonological Awareness`,
                            status: `active`,
                        },
                        {
                            id: `2d1152a3-fb03-4c4e-aeba-98856c3241bd`,
                            name: `Vocabulary`,
                            status: `active`,
                        },
                    ],
                },
                {
                    id: `c3175001-2d1e-4b00-aacf-d188f4ae5cdf`,
                    name: `Literacy`,
                    status: `active`,
                    subcategories: [
                        {
                            id: `9b955fb9-8eda-4469-bd31-4e8f91192663`,
                            name: `Emergent Writing`,
                            status: `active`,
                        },
                        {
                            id: `644ba535-904c-4919-8b8c-688df2b6f7ee`,
                            name: `Emergent Reading`,
                            status: `active`,
                        },
                    ],
                },
                {
                    id: `19ac71c4-04e4-4d1c-8526-1acb292b7137`,
                    name: `Whole-Child`,
                    status: `active`,
                    subcategories: [
                        {
                            id: `96f81756-70e3-41e5-9143-740376574e35`,
                            name: `Social-Emotional Learning`,
                            status: `active`,
                        },
                        {
                            id: `0e6b1c2b-5e2f-47e1-8422-2a183f3e15c7`,
                            name: `Cognitive Development`,
                            status: `active`,
                        },
                        {
                            id: `144a3478-1946-4460-a965-0d7d74e63d65`,
                            name: `Physical Coordination`,
                            status: `active`,
                        },
                    ],
                },
                {
                    id: `d896bf1a-fb5b-4a57-b833-87b0959ba926`,
                    name: `Knowledge`,
                    status: `active`,
                    subcategories: [
                        {
                            id: `49e73e4f-8ffc-47e3-9b87-0f9686d361d7`,
                            name: `Technology`,
                            status: `active`,
                        },
                        {
                            id: `852c3495-1ced-4580-a584-9d475217f3d5`,
                            name: `Character Education`,
                            status: `active`,
                        },
                        {
                            id: `cd06e622-a323-40f3-8409-5384395e00d2`,
                            name: `Science`,
                            status: `active`,
                        },
                        {
                            id: `81b09f61-4509-4ce0-b099-c208e62870f9`,
                            name: `Math`,
                            status: `active`,
                        },
                        {
                            id: `6fb79402-2fb6-4415-874c-338c949332ed`,
                            name: `Art`,
                            status: `active`,
                        },
                        {
                            id: `5b405510-384a-4721-a526-e12b3cbf2092`,
                            name: `Engineering`,
                            status: `active`,
                        },
                        {
                            id: `9a52fb0a-6ce8-45df-92a0-f25b5d3d2344`,
                            name: `Music`,
                            status: `active`,
                        },
                        {
                            id: `4114f381-a7c5-4e88-be84-2bef4eb04ad0`,
                            name: `Health`,
                            status: `active`,
                        },
                        {
                            id: `f4b07251-1d67-4a84-bcda-86c71cbf9cfd`,
                            name: `Social Studies`,
                            status: `active`,
                        },
                        {
                            id: `3b148168-31d0-4bef-9152-63c3ff516180`,
                            name: `Miscellaneous`,
                            status: `active`,
                        },
                    ],
                },
            ],
        },
    ],
    grades: [
        {
            id: `98461ca1-06a1-432a-97d0-4e1dff33e1a5`,
            name: `None Specified`,
            status: `active`,
            system: true,
        },
    ],
};

const programC: Program =     {
    id: `56e24fa0-e139-4c80-b365-61c9bc42cd3f`,
    name: `Bada Sound`,
    status: `active`,
    system: true,
    age_ranges: [
        {
            id: `fe0b81a4-5b02-4548-8fb0-d49cd4a4604a`,
            name: `5 - 6 year(s)`,
            high_value: 6,
            high_value_unit: `year`,
            low_value: 5,
            low_value_unit: `year`,
            status: `active`,
            system: true,
        },
        {
            id: `21f1da64-b6c8-4e74-9fef-09d08cfd8e6c`,
            name: `7 - 8 year(s)`,
            high_value: 8,
            high_value_unit: `year`,
            low_value: 7,
            low_value_unit: `year`,
            status: `active`,
            system: true,
        },
        {
            id: `7965d220-619d-400f-8cab-42bd98c7d23c`,
            name: `3 - 4 year(s)`,
            high_value: 4,
            high_value_unit: `year`,
            low_value: 3,
            low_value_unit: `year`,
            status: `active`,
            system: true,
        },
        {
            id: `bb7982cd-020f-4e1a-93fc-4a6874917f07`,
            name: `4 - 5 year(s)`,
            high_value: 5,
            high_value_unit: `year`,
            low_value: 4,
            low_value_unit: `year`,
            status: `active`,
            system: true,
        },
    ],
    subjects: [
        {
            id: `b19f511e-a46b-488d-9212-22c0369c8afd`,
            name: `Language/Literacy`,
            status: `active`,
            system: true,
            categories: [
                {
                    id: `0e66242a-4733-4970-a055-d0d6486f8674`,
                    name: `Fine Motor Skills`,
                    status: `active`,
                    subcategories: [
                        {
                            id: `bf89c192-93dd-4192-97ab-f37198548ead`,
                            name: `Hand-Eye Coordination`,
                            status: `active`,
                        },
                        {
                            id: `963729a4-7853-49d2-b75d-2c61d291afee`,
                            name: `Sensory`,
                            status: `active`,
                        },
                    ],
                },
                {
                    id: `e63956d9-3a36-40b3-a89d-bd45dc8c3181`,
                    name: `Gross Motor Skills`,
                    status: `active`,
                    subcategories: [
                        {
                            id: `f78c01f9-4b8a-480c-8c4b-80d1ec1747a7`,
                            name: `Complex Movements`,
                            status: `active`,
                        },
                        {
                            id: `f5a1e3a6-c0b1-4b2f-991f-9df7897dac67`,
                            name: `Physical Skills`,
                            status: `active`,
                        },
                        {
                            id: `bd7adbd0-9ce7-4c50-aa8e-85b842683fb5`,
                            name: `Simple Movements`,
                            status: `active`,
                        },
                    ],
                },
                {
                    id: `b0b983e4-bf3c-4315-912e-67c8de4f9e11`,
                    name: `Cognitive Skills`,
                    status: `active`,
                    subcategories: [
                        {
                            id: `f385c1ec-6cfa-4f49-a219-fd28374cf2a6`,
                            name: `Visual`,
                            status: `active`,
                        },
                        {
                            id: `b32321db-3b4a-4b1e-8db9-c485d045bf01`,
                            name: `Logic & Memory`,
                            status: `active`,
                        },
                    ],
                },
                {
                    id: `84619bee-0b1f-447f-8208-4a39f32062c9`,
                    name: `Personal Development`,
                    status: `active`,
                    subcategories: [
                        {
                            id: `ba77f705-9087-4424-bff9-50fcd0b1731e`,
                            name: `Social Skills`,
                            status: `active`,
                        },
                        {
                            id: `824bb6cb-0169-4335-b7a5-6ece2b929da3`,
                            name: `Emotional Skills`,
                            status: `active`,
                        },
                    ],
                },
                {
                    id: `4b247e7e-dcf9-46a6-a477-a69635142d14`,
                    name: `Oral Language`,
                    status: `active`,
                    subcategories: [
                        {
                            id: `843e4fea-7f4d-4746-87ff-693f5a44b467`,
                            name: `Communication`,
                            status: `active`,
                        },
                        {
                            id: `b2cc7a69-4e64-4e97-9587-0078dccd845a`,
                            name: `Language Support`,
                            status: `active`,
                        },
                        {
                            id: `2d1152a3-fb03-4c4e-aeba-98856c3241bd`,
                            name: `Vocabulary`,
                            status: `active`,
                        },
                    ],
                },
                {
                    id: `59565e03-8d8f-4475-a231-cfc551f004b5`,
                    name: `Literacy`,
                    status: `active`,
                    subcategories: [
                        {
                            id: `a7850bd6-f5fd-4016-b708-7b823784ef0a`,
                            name: `Writing`,
                            status: `active`,
                        },
                        {
                            id: `39e96a23-5ac3-47c9-94fc-e71965f75880`,
                            name: `Phonemic Awareness, Phonics, and Word Recognition`,
                            status: `active`,
                        },
                        {
                            id: `01191172-b276-449f-ab11-8e66e990941e`,
                            name: `Reading`,
                            status: `active`,
                        },
                    ],
                },
                {
                    id: `880bc0fd-0209-4f72-999d-3103f9577edf`,
                    name: `Whole-Child`,
                    status: `active`,
                    subcategories: [
                        {
                            id: `96f81756-70e3-41e5-9143-740376574e35`,
                            name: `Social-Emotional Learning`,
                            status: `active`,
                        },
                        {
                            id: `0e6b1c2b-5e2f-47e1-8422-2a183f3e15c7`,
                            name: `Cognitive Development`,
                            status: `active`,
                        },
                        {
                            id: `144a3478-1946-4460-a965-0d7d74e63d65`,
                            name: `Physical Coordination`,
                            status: `active`,
                        },
                    ],
                },
                {
                    id: `bac3d444-6dcc-4d6c-a4d7-fb6c96fcfc72`,
                    name: `Knowledge`,
                    status: `active`,
                    subcategories: [
                        {
                            id: `49e73e4f-8ffc-47e3-9b87-0f9686d361d7`,
                            name: `Technology`,
                            status: `active`,
                        },
                        {
                            id: `852c3495-1ced-4580-a584-9d475217f3d5`,
                            name: `Character Education`,
                            status: `active`,
                        },
                        {
                            id: `cd06e622-a323-40f3-8409-5384395e00d2`,
                            name: `Science`,
                            status: `active`,
                        },
                        {
                            id: `81b09f61-4509-4ce0-b099-c208e62870f9`,
                            name: `Math`,
                            status: `active`,
                        },
                        {
                            id: `6fb79402-2fb6-4415-874c-338c949332ed`,
                            name: `Art`,
                            status: `active`,
                        },
                        {
                            id: `5b405510-384a-4721-a526-e12b3cbf2092`,
                            name: `Engineering`,
                            status: `active`,
                        },
                        {
                            id: `9a52fb0a-6ce8-45df-92a0-f25b5d3d2344`,
                            name: `Music`,
                            status: `active`,
                        },
                        {
                            id: `4114f381-a7c5-4e88-be84-2bef4eb04ad0`,
                            name: `Health`,
                            status: `active`,
                        },
                        {
                            id: `f4b07251-1d67-4a84-bcda-86c71cbf9cfd`,
                            name: `Social Studies`,
                            status: `active`,
                        },
                        {
                            id: `3b148168-31d0-4bef-9152-63c3ff516180`,
                            name: `Miscellaneous`,
                            status: `active`,
                        },
                    ],
                },
                {
                    id: `fc06f364-98fe-487f-97fd-d2d6358dccc6`,
                    name: `Speech & Language Skills`,
                    status: `active`,
                    subcategories: [
                        {
                            id: `8b955cbc-6808-49b2-adc0-5bec8b59f4fe`,
                            name: `Phonics`,
                            status: `active`,
                        },
                        {
                            id: `2b6b5d54-0243-4c7e-917a-1627f107f198`,
                            name: `Speaking & Listening`,
                            status: `active`,
                        },
                        {
                            id: `2d1152a3-fb03-4c4e-aeba-98856c3241bd`,
                            name: `Vocabulary`,
                            status: `active`,
                        },
                        {
                            id: `3fca3a2b-97b6-4ec9-a5b1-1d0ef5f1b445`,
                            name: `Reading Skills and Comprehension`,
                            status: `active`,
                        },
                        {
                            id: `9a9882f1-d890-461c-a710-ca37fb78ddf5`,
                            name: `Sight Words`,
                            status: `active`,
                        },
                        {
                            id: `0fd7d721-df1b-41eb-baa4-08ba4ac2b2e7`,
                            name: `Thematic Concepts`,
                            status: `active`,
                        },
                    ],
                },
            ],
        },
    ],
    grades: [
        {
            id: `98461ca1-06a1-432a-97d0-4e1dff33e1a5`,
            name: `None Specified`,
            status: `active`,
            system: true,
        },
    ],
};

const programD: Program = {
    id: `d1bbdcc5-0d80-46b0-b98e-162e7439058f`,
    name: `Bada STEM`,
    status: `active`,
    system: true,
    age_ranges: [
        {
            id: `fe0b81a4-5b02-4548-8fb0-d49cd4a4604a`,
            name: `5 - 6 year(s)`,
            high_value: 6,
            high_value_unit: `year`,
            low_value: 5,
            low_value_unit: `year`,
            status: `active`,
            system: true,
        },
        {
            id: `145edddc-2019-43d9-97e1-c5830e7ed689`,
            name: `6 - 7 year(s)`,
            high_value: 7,
            high_value_unit: `year`,
            low_value: 6,
            low_value_unit: `year`,
            status: `active`,
            system: true,
        },
        {
            id: `21f1da64-b6c8-4e74-9fef-09d08cfd8e6c`,
            name: `7 - 8 year(s)`,
            high_value: 8,
            high_value_unit: `year`,
            low_value: 7,
            low_value_unit: `year`,
            status: `active`,
            system: true,
        },
        {
            id: `7965d220-619d-400f-8cab-42bd98c7d23c`,
            name: `3 - 4 year(s)`,
            high_value: 4,
            high_value_unit: `year`,
            low_value: 3,
            low_value_unit: `year`,
            status: `active`,
            system: true,
        },
        {
            id: `bb7982cd-020f-4e1a-93fc-4a6874917f07`,
            name: `4 - 5 year(s)`,
            high_value: 5,
            high_value_unit: `year`,
            low_value: 4,
            low_value_unit: `year`,
            status: `active`,
            system: true,
        },
    ],
    subjects: [
        {
            id: `29d24801-0089-4b8e-85d3-77688e961efb`,
            name: `Science`,
            status: `active`,
            system: true,
            categories: [
                {
                    id: `6090e473-ec19-4bf0-ae5c-2d6a4c793f55`,
                    name: `Speech & Language Skills`,
                    status: `active`,
                    subcategories: [
                        {
                            id: `01191172-b276-449f-ab11-8e66e990941e`,
                            name: `Reading`,
                            status: `active`,
                        },
                        {
                            id: `a7850bd6-f5fd-4016-b708-7b823784ef0a`,
                            name: `Writing`,
                            status: `active`,
                        },
                        {
                            id: `55cbd434-36ce-4c57-b47e-d7119b578d7e`,
                            name: `Fluency`,
                            status: `active`,
                        },
                        {
                            id: `8b955cbc-6808-49b2-adc0-5bec8b59f4fe`,
                            name: `Phonics`,
                            status: `active`,
                        },
                        {
                            id: `c06b848d-8769-44e9-8dc7-929588cec0bc`,
                            name: `Speaking`,
                            status: `active`,
                        },
                        {
                            id: `eb29827a-0053-4eee-83cd-8f4afb1b7cb4`,
                            name: `Comprehension`,
                            status: `active`,
                        },
                        {
                            id: `ddf87dff-1eb0-4971-9b27-2aaa534f34b1`,
                            name: `Listening`,
                            status: `active`,
                        },
                    ],
                },
                {
                    id: `da9fa132-dcf7-4148-9037-b381850ba088`,
                    name: `Fine Motor Skills`,
                    status: `active`,
                    subcategories: [
                        {
                            id: `d50cff7c-b0c7-43be-8ec7-877fa4c9a6fb`,
                            name: `Drag`,
                            status: `active`,
                        },
                        {
                            id: `e2190c0c-918d-4a05-a045-6696ae31d5c4`,
                            name: `Click`,
                            status: `active`,
                        },
                        {
                            id: `a7850bd6-f5fd-4016-b708-7b823784ef0a`,
                            name: `Writing`,
                            status: `active`,
                        },
                        {
                            id: `bea9244e-ff17-47fc-8e7c-bceadf0f4f6e`,
                            name: `Drawing`,
                            status: `active`,
                        },
                        {
                            id: `11351e3f-afc3-476e-b3af-a0c7718269ac`,
                            name: `Coloring`,
                            status: `active`,
                        },
                        {
                            id: `7848bb23-2bb9-4108-938b-51f2f7d1d30f`,
                            name: `Tracing`,
                            status: `active`,
                        },
                    ],
                },
                {
                    id: `585f38e6-f7be-45f2-855a-f2a4bddca125`,
                    name: `Gross Motor Skills`,
                    status: `active`,
                    subcategories: [
                        {
                            id: `f78c01f9-4b8a-480c-8c4b-80d1ec1747a7`,
                            name: `Complex Movements`,
                            status: `active`,
                        },
                        {
                            id: `f5a1e3a6-c0b1-4b2f-991f-9df7897dac67`,
                            name: `Physical Skills`,
                            status: `active`,
                        },
                        {
                            id: `bd7adbd0-9ce7-4c50-aa8e-85b842683fb5`,
                            name: `Simple Movements`,
                            status: `active`,
                        },
                    ],
                },
                {
                    id: `c3ea1b4a-d220-4248-9b3f-07559b415c56`,
                    name: `Cognitive Skills`,
                    status: `active`,
                    subcategories: [
                        {
                            id: `b9d5a570-5be3-491b-9fdc-d26ea1c13847`,
                            name: `Reasoning Skills`,
                            status: `active`,
                        },
                        {
                            id: `9a1e0589-0361-40e1-851c-b95b641e271e`,
                            name: `Critical Thinking (Interpretation, Analysis, Evaluation, Inference, Explanation, and Self-Regulation)`,
                            status: `active`,
                        },
                        {
                            id: `8d3f987a-7f7c-4035-a709-9526060b2177`,
                            name: `Science Process (Observing, Classifying, Communicating, Measuring, Predicting)`,
                            status: `active`,
                        },
                    ],
                },
                {
                    id: `7826ff58-25d0-41f1-b38e-3e3a77ed32f6`,
                    name: `Social and Emotional`,
                    status: `active`,
                    subcategories: [
                        {
                            id: `188c621a-cbc7-42e2-9d01-56f4847682cb`,
                            name: `Empathy`,
                            status: `active`,
                        },
                        {
                            id: `b79735db-91c7-4bcb-860b-fe23902f81ea`,
                            name: `Social Interactions`,
                            status: `active`,
                        },
                        {
                            id: `6ccc8306-1a9e-42bd-83ff-55bac3449853`,
                            name: `Self-Control`,
                            status: `active`,
                        },
                        {
                            id: `c79be603-ccf4-4284-9c8e-61b55ec53067`,
                            name: `Self-Identity`,
                            status: `active`,
                        },
                    ],
                },
            ],
        },
    ],
    grades: [
        {
            id: `d7e2e258-d4b3-4e95-b929-49ae702de4be`,
            name: `PreK-1`,
            status: `active`,
            system: true,
        },
        {
            id: `3e7979f6-7375-450a-9818-ddb09b250bb2`,
            name: `PreK-2`,
            status: `active`,
            system: true,
        },
        {
            id: `81dcbcc6-3d70-4bdf-99bc-14833c57c628`,
            name: `K`,
            status: `active`,
            system: true,
        },
        {
            id: `100f774a-3d7e-4be5-9c2c-ae70f40f0b50`,
            name: `Grade 1`,
            status: `active`,
            system: true,
        },
        {
            id: `9d3e591d-06a6-4fc4-9714-cf155a15b415`,
            name: `Grade 2`,
            status: `active`,
            system: true,
        },
    ],
};

const programs: Program[] = [
    programA,
    programB,
    programC,
    programD,
];

test(`should create an array of objects that conforms the Programs Table ProgramRow interface`, () => {
    const rows = programs.filter((status) => status.status === `active`).map(organizationProgram);

    const final = [
        {
            id: `7a8c5021-142b-44b1-b60b-275c29d132fe`,
            name: `Bada Read`,
            grades: [ `None Specified` ],
            ageRanges: [
                `5 - 6 Year(s)`,
                `7 - 8 Year(s)`,
                `3 - 4 Year(s)`,
                `4 - 5 Year(s)`,
            ],
            subjects: [ `Language/Literacy` ],
            system: true,
        },
        {
            id: `93f293e8-2c6a-47ad-bc46-1554caac99e4`,
            name: `Bada Rhyme`,
            grades: [ `None Specified` ],
            ageRanges: [
                `5 - 6 Year(s)`,
                `3 - 4 Year(s)`,
                `4 - 5 Year(s)`,
            ],
            subjects: [ `Language/Literacy` ],
            system: true,
        },
        {
            id: `56e24fa0-e139-4c80-b365-61c9bc42cd3f`,
            name: `Bada Sound`,
            grades: [ `None Specified` ],
            ageRanges: [
                `5 - 6 Year(s)`,
                `7 - 8 Year(s)`,
                `3 - 4 Year(s)`,
                `4 - 5 Year(s)`,
            ],
            subjects: [ `Language/Literacy` ],
            system: true,
        },
        {
            id: `d1bbdcc5-0d80-46b0-b98e-162e7439058f`,
            name: `Bada STEM`,
            grades: [
                `PreK-1`,
                `PreK-2`,
                `K`,
                `Grade 1`,
                `Grade 2`,
            ],
            ageRanges: [
                `5 - 6 Year(s)`,
                `6 - 7 Year(s)`,
                `7 - 8 Year(s)`,
                `3 - 4 Year(s)`,
                `4 - 5 Year(s)`,
            ],
            subjects: [ `Science` ],
            system: true,
        },
    ];

    expect(rows).toEqual(final);
});

test(`should return an empty array`, () => {
    const rows = [].map(organizationProgram);

    expect(rows).toEqual([]);
});
