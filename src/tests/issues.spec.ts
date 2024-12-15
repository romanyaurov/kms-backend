

describe('PATCH /issues', () => {
  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('should move an issue within one column and redefine orders', async () => {
    const project = await ProjectModel.findOne({ name: 'Management App' });
    const issues = await IssueModel.find({
      project: project?._id,
      column: project?.columns.find((col) => col.title === 'to_do')?._id,
    });

    const targetIssue = issues.find(
      (issue) => issue.title === 'Conduct security audit'
    );

    const response = await request(app)
      .patch(`/api/issues/${(targetIssue?._id as Types.ObjectId).toString()}`)
      .send({ column: targetIssue?.column, order: 1 });

    const finalColumnState = await IssueModel.find({
      project: targetIssue?.project,
      column: targetIssue?.column,
    });

    const finalIssueState = finalColumnState.find(
      (issue) => issue.title === 'Conduct security audit'
    );

    const finalOrdersState = finalColumnState
      .map((issue) => issue.order)
      .sort((a, b) => a - b);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toEqual({
      error: false,
      message: 'Issue moved successfully',
    });
    expect(finalColumnState).toBeInstanceOf(Array);
    expect(finalColumnState).toHaveLength(5);
    expect(finalIssueState?.order).toBe(1);
    expect(finalOrdersState).toEqual([1, 2, 3, 4, 5]);
  });

  it('should move an issue from one column to other', async () => {
    const project = await ProjectModel.findOne({ name: 'New Project' });
    const issues = await IssueModel.find({
      project: project?._id,
      column: {
        $in: [
          project?.columns.find((col) => col.title === 'backlog')?._id,
          project?.columns.find((col) => col.title === 'to_do')?._id,
        ],
      },
    });

    const targetIssue = issues.find(
      (issue) => issue.title === 'Optimize database performance'
    );

    const response = await request(app)
      .patch(`/api/issues/${(targetIssue?._id as Types.ObjectId).toString()}`)
      .send({
        column: project?.columns.find((col) => col.title === 'to_do')?._id,
        order: 3,
      });

    const finalPrevColumnState = await IssueModel.find({
      project: project?._id,
      column: project?.columns.find((col) => col.title === 'backlog')?._id,
    });

    const finalCurColumnState = await IssueModel.find({
      project: project?._id,
      column: project?.columns.find((col) => col.title === 'to_do')?._id,
    });

    const finalIssueState = finalCurColumnState.find(
      (issue) => issue.title === 'Optimize database performance'
    );

    const finalPrevOrdersState = finalPrevColumnState
      .map((issue) => issue.order)
      .sort((a, b) => a - b);

    const finalCurOrdersState = finalCurColumnState
      .map((issue) => issue.order)
      .sort((a, b) => a - b);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toEqual({
      error: false,
      message: 'Issue moved successfully',
    });
    expect(finalPrevColumnState).toBeInstanceOf(Array);
    expect(finalPrevColumnState).toHaveLength(3);
    expect(finalCurColumnState).toBeInstanceOf(Array);
    expect(finalCurColumnState).toHaveLength(5);
    expect(finalIssueState?.order).toBe(3);
    expect(finalPrevOrdersState).toEqual([1, 2, 3]);
    expect(finalCurOrdersState).toEqual([1, 2, 3, 4, 5]);
    expect(finalCurColumnState).toContain(finalIssueState);
    expect(finalPrevColumnState).not.toContain(finalIssueState);
  });
});
