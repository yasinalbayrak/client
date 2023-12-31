import React, { useState, useEffect } from 'react';
import EligibilityTable from "./EligibilityTable";
import Sidebar from "../components/Sidebar";
import { Box, Button, Grid } from "@mui/material";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { checkStudentEligibility, applyToPost } from '../apiCalls';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BackButton from '../components/buttons/BackButton';
import SendIcon from "@mui/icons-material/Send";
import QuizIcon from '@mui/icons-material/Quiz';
import { toast } from 'react-toastify';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import "../styles/apply-button.css"

export default function EligibilityPage() {
    const userID = useSelector((state) => state.user.id);
    const { id: ApplicationId } = useParams();
    const [eligibilityInfo, setEligibilityInfo] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        async function checkEligibility() {
            try {
                const result = await checkStudentEligibility(ApplicationId);
                setEligibilityInfo(result);

            } catch (error) {
                /* */
            }
        }

        checkEligibility();
    }, [ApplicationId, userID]);

    const onSubmit = () => {

        applyToPost(ApplicationId, userID, []).then(_ => {
            navigate("/home", { replace: true });
            toast.success("Your application has been received successfully.");
        }).catch((_) => {
            /* Already handled */
        });

    };

    return <>
        <Box sx={{ display: "flex" }}>
            <Sidebar />
            <Box component="main" sx={{ flexGrow: 1, m: 3 }}>
                <BackButton to={`/apply/${ApplicationId}`} />
                {eligibilityInfo && <EligibilityTable eligibility={eligibilityInfo.eligibility} />}
                <br />
                <Box sx={{ padding: "0 5%" }}>
                    {eligibilityInfo &&
                        <Alert severity={eligibilityInfo.isStudentEligible ? "success" : "error"}>
                            <AlertTitle>
                                <strong>{eligibilityInfo.isStudentEligible ? "Eligible" : "Not Eligible"}</strong>
                            </AlertTitle>
                            {eligibilityInfo.isStudentEligible ?
                                "You are eligible to apply this application" :
                                `You are not eligible to apply this application. ${eligibilityInfo.notEligibleCourseCount} out of ${eligibilityInfo.totalCourseCount} requirement(s) failed.`
                            }
                        </Alert>
                    }
                </Box>

                <br />
                {eligibilityInfo && <Grid item container justifyContent="center" alignItems="center">
                    {eligibilityInfo.isStudentEligible ?
                        /* Student Eligible */
                        eligibilityInfo.questionCount > 0 ? (
                            <Button variant="contained" startIcon={<QuizIcon />} color="secondary" onClick={() => navigate("/questionPage/" + ApplicationId, { replace: true })}>
                                Continue with questions
                            </Button>
                        ) : (
                            <button class="button" onClick={onSubmit}>
                                Apply Now
                                <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
                                    <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 10.28a.75.75 0 000-1.06l-3-3a.75.75 0 10-1.06 1.06l1.72 1.72H8.25a.75.75 0 000 1.5h5.69l-1.72 1.72a.75.75 0 101.06 1.06l3-3z" clip-rule="evenodd"></path>
                                </svg>
                            </button>
                        )
                        :
                        /* Student NOT Eligible */
                        <Grid item container direction="rows" alignItems="center" justifyContent="center" spacing={12}>
                            <Grid item>
                                <Button variant="contained" startIcon={<ArrowBackIcon />} color="info" onClick={() => navigate("/home", { replace: true })}>
                                    Go Back to Announcements
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button variant="contained" startIcon={<UploadFileIcon />} onClick={() => navigate("/transcriptUploadPage/" + ApplicationId, { replace: true })} color="primary">
                                    Upload new transcript
                                </Button>
                            </Grid>
                        </Grid>
                    }
                </Grid>
                }


            </Box>
        </Box>
    </>
}