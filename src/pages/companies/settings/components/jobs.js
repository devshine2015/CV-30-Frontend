import React from 'react';

import JobItem from '../../../jobs/list/components/jobItem';

const JobsList = props => {
    const { currentCompany: { company }, editJob } = props;
    const { jobs } = company;

    const activeJobs = jobs.filter(job => job.status === 'active');
    const archivedJobs = jobs.filter(job => job.status === 'archived');
    const draftJobs = jobs.filter(job => job.status === 'draft');

    return (
        <React.Fragment>
            {(jobs && jobs.length > 0) ?
                <div className='jobsList'>
                    {(activeJobs && activeJobs.length > 0) &&
                        <React.Fragment>
                            <p className='helperText'>
                                <i className="fas fa-angle-double-right" />
                                Active jobs
                            </p>
                            {activeJobs.map(job => (
                                <JobItem
                                    key={job.id}
                                    company={company}
                                    job={{
                                        ...job,
                                        company
                                    }}
                                    editJob={editJob}
                                />))
                            }
                        </React.Fragment>
                    }
                    {(draftJobs && draftJobs.length > 0) &&
                        <React.Fragment>
                            <p className='helperText'>
                                <i className="fas fa-angle-double-right" />
                                Job drafts
                            </p>
                            {draftJobs.map(job => (
                                <JobItem
                                    key={job.id}
                                    company={company}
                                    job={{
                                        ...job,
                                        company
                                    }}
                                    editJob={editJob}
                                />))
                            }
                        </React.Fragment>
                    }
                    {(archivedJobs && archivedJobs.length > 0) &&
                        <React.Fragment>
                            <p className='helperText'>
                                <i className="fas fa-angle-double-right" />
                                Archived jobs
                            </p>
                            {archivedJobs.map(job => (
                                <JobItem
                                    key={job.id}
                                    company={company}
                                    job={{
                                        ...job,
                                        company
                                    }}
                                    editJob={editJob}
                                />))
                            }
                        </React.Fragment>
                    }
                </div>
                :
                <p className='noJobs'>No jobs</p>
            }
        </React.Fragment>
    );
}

export default JobsList;