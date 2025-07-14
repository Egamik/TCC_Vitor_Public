import http from 'k6/http'
import { check, sleep, group } from 'k6'
import { uuidv4 } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js'

// Base API URL
const BASE_URL = 'http://api:8080'

// Load test configuration
export const options = {
    scenarios: {
        normal_load: {
            executor: 'per-vu-iterations',
            vus: 2,
            iterations: 50,
            maxDuration: '30m'
        },
    },
    thresholds: {
        http_req_duration: ['p(95)<5000'], // 95% of requests under 5s
    },
}

export default function () {
    const patientID = `patient_${uuidv4()}`
    const professionalID = `pro_${uuidv4()}`

    group('1. Register users', () => {
        // 1. Register Patient
        let res = http.post(`${BASE_URL}/wallet/`, JSON.stringify({
            userId: patientID,
            role: 'patient'
        }), {
            headers: { 'Content-Type': 'application/json' }
        })
        check(res, { 'User enrolled': (r) => r.status === 200 })
    
        // 2. Register Professional
        res = http.post(`${BASE_URL}/wallet/`, JSON.stringify({
            userId: professionalID,
            role: 'professional'
        }), {
            headers: { 'Content-Type': 'application/json' }
        })
        check(res, { 'Professional enrolled': (r) => r.status === 200 })

        sleep(1)
    })

    group('2. Set up AccessList', () => {
        // 3. Set active ID: patient
        let res = http.post(`${BASE_URL}/wallet/active`, JSON.stringify({ id: patientID }), {
            headers: { 'Content-Type': 'application/json' }
        })
        check(res, { 'Activated patient': (r) => r.status === 200 })
    
        // 4. Create AccessList asset
        res = http.post(`${BASE_URL}/al/asset`, JSON.stringify({
            ownerID: patientID
        }), {
            headers: { 'Content-Type': 'application/json' }
        })
        check(res, { 
            'Access asset - created': (r) => r.status === 200
        })
    
        sleep(3)

        // 5. Add professional to AccessList
        res = http.post(`${BASE_URL}/al/id`, JSON.stringify({
            ownerID: patientID,
            professionalID: professionalID
        }), {
            headers: { 'Content-Type': 'application/json' }
        })
        check(res, { 
            'Access AddID - success': (r) => r.status === 200
        })
        
        sleep(3)
    })

    group('3. Add EHR record', () => {
        // 6. Set active ID: professional
        let res = http.post(`${BASE_URL}/wallet/active`, JSON.stringify({ id: professionalID }), {
            headers: { 'Content-Type': 'application/json' }
        })
        check(res, { 'Activated professional': (r) => r.status === 200 })
    
        // 7. Create EHR asset
        res = http.post(`${BASE_URL}/ehr/record`, JSON.stringify({
            ownerID: patientID,
            patientPrivate: {
                name: "patient",
                birthday: "2001-01-01T00:00:00Z",
                cpf: "12345678901"
            }
        }), {
            headers: { 'Content-Type': 'application/json' }
        })
        check(res, { 'Created EHR record': (r) => r.status === 200 })
    
        sleep(3)

        // 8. Professional creates EHR prescription record
        res = http.post(`${BASE_URL}/ehr/prescription`, JSON.stringify({
            ownerID: patientID,
            prescriptionJSON: {
                professionalID: professionalID,
                date: "2001-01-01T00:00:00Z",
                description: "some description",
                medication: "bepantol",
                dosage: "10mg"
            }
        }), {
            headers: { 'Content-Type': 'application/json' }
        })
        check(res, { 'EHR record written': (r) => r.status === 200 })

        sleep(1)
    })

}
