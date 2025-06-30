import empInsurance from '../models/empInsurance.js'; 


export const getEmployeeInsurance = async (req, res) => {
    try {
        const insuranceRecords = await empInsurance.find();

        if (!insuranceRecords || insuranceRecords.length === 0) {
            return res.status(404).json({ message: 'No insurance records found' });
        }
        res.status(200).json({
            message: 'All insurance records retrieved successfully',
            insuranceRecords,
        });
    } catch (error) {
        console.error('Error fetching all insurance records:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
